// Client behavior for PublicationList.astro. Imported by the component's <script>,
// which Astro bundles into the page.

import { formatCount } from "../lib/count";
import { parseHashQuery } from "../lib/hash-query";
import { matchesTerms, normalizeHaystack, termsOf } from "../lib/search-query";

export const initPublicationList = () => {
  document.querySelectorAll<HTMLElement>("[data-publications]").forEach((publicationList) => {
    const input = publicationList.querySelector<HTMLInputElement>("[data-publication-input]");
    const count = publicationList.querySelector<HTMLElement>(".publication-count");
    const empty = publicationList.querySelector<HTMLElement>("[data-publication-empty]");
    const entries = [...publicationList.querySelectorAll<HTMLElement>("[data-publication-entry]")];
    // The search text is server-rendered and never mutated, so normalize it once
    // here rather than on every keystroke.
    const entryHaystacks = new Map(entries.map((entry) => [entry, normalizeHaystack(entry.dataset.search ?? "")]));
    const groups = [...publicationList.querySelectorAll<HTMLElement>("[data-publication-group]")];
    const annotationWrappers = [...publicationList.querySelectorAll<HTMLElement>("[data-publication-annotation-wrap]")];
    const lightbox = publicationList.parentElement?.querySelector<HTMLDialogElement>("[data-publication-lightbox]");
    const lightboxImage = lightbox?.querySelector<HTMLImageElement>("[data-publication-lightbox-image]");
    const locale = publicationList.dataset.countLocale ?? "en";
    // Every count element carries the plural forms the server rendered it with,
    // so filtering can restate the number in the same locale.
    const countText = (element: HTMLElement, value: number) =>
      formatCount(locale, { one: element.dataset.countOne ?? "", other: element.dataset.countOther ?? "" }, value);
    const closeLightbox = () => lightbox?.close();
    const closeAnnotations = () => {
      annotationWrappers.forEach((wrapper) => {
        wrapper.classList.remove("is-open");
        wrapper.querySelector("[data-publication-annotation]")?.setAttribute("aria-expanded", "false");
        wrapper.querySelector(".publication-annotation-popover")?.setAttribute("aria-hidden", "true");
      });
    };

    annotationWrappers.forEach((wrapper) => {
      const button = wrapper.querySelector<HTMLButtonElement>("[data-publication-annotation]");
      const popover = wrapper.querySelector<HTMLElement>(".publication-annotation-popover");
      button?.addEventListener("focus", () => {
        closeAnnotations();
        popover?.setAttribute("aria-hidden", "false");
      });
      button?.addEventListener("blur", () => {
        if (!wrapper.classList.contains("is-open")) popover?.setAttribute("aria-hidden", "true");
      });
    });

    const filter = (value: string) => {
      const query = termsOf(value);
      let matches = 0;
      entries.forEach((entry) => {
        const visible = matchesTerms(query, entryHaystacks.get(entry) ?? "");
        entry.hidden = !visible;
        if (visible) matches += 1;
      });
      groups.forEach((group) => {
        const visible = group.querySelectorAll("[data-publication-entry]:not([hidden])").length;
        group.hidden = visible === 0;
        const groupCount = group.querySelector<HTMLElement>("[data-section-count]");
        if (groupCount) groupCount.textContent = countText(groupCount, visible);
      });
      if (count) count.textContent = countText(count, matches);
      if (empty) empty.hidden = matches > 0;
    };

    input?.addEventListener("input", () => filter(input.value));
    const hashQuery = parseHashQuery(window.location.hash.slice(1));
    if (input && hashQuery) input.value = hashQuery;
    filter(hashQuery);

    publicationList.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const annotationButton = target.closest<HTMLButtonElement>("[data-publication-annotation]");
      if (annotationButton) {
        const wrapper = annotationButton.closest<HTMLElement>("[data-publication-annotation-wrap]");
        const popover = wrapper?.querySelector<HTMLElement>(".publication-annotation-popover");
        if (!wrapper) return;
        const open = !wrapper.classList.contains("is-open");
        closeAnnotations();
        if (open) {
          wrapper.classList.add("is-open");
          annotationButton.setAttribute("aria-expanded", "true");
          popover?.setAttribute("aria-hidden", "false");
        }
        return;
      }
      if (!target.closest("[data-publication-annotation-wrap]")) closeAnnotations();
      const previewButton = target.closest<HTMLButtonElement>("[data-publication-preview]");
      if (previewButton && lightbox && lightboxImage) {
        const source = previewButton.dataset.zoomSrc;
        if (source) {
          lightboxImage.src = source;
          lightboxImage.alt = previewButton.dataset.previewAlt ?? "";
          lightbox.showModal();
        }
        return;
      }
      const toggle = target.closest<HTMLButtonElement>("[data-publication-toggle]");
      if (toggle) {
        const panel = document.getElementById(toggle.dataset.publicationToggle ?? "");
        if (!panel) return;
        const open = panel.classList.toggle("is-open");
        panel.inert = !open;
        panel.setAttribute("aria-hidden", String(!open));
        toggle.setAttribute("aria-expanded", String(open));
        return;
      }
      const moreAuthors = target.closest<HTMLButtonElement>("[data-more-authors]");
      if (moreAuthors) {
        const list = moreAuthors.nextElementSibling as HTMLElement | null;
        if (!list) return;
        const open = !list.hidden;
        list.hidden = open;
        moreAuthors.textContent = open
          ? (moreAuthors.dataset.collapsedLabel ?? "more authors")
          : (moreAuthors.dataset.expandedLabel ?? "hide authors");
        moreAuthors.setAttribute("aria-expanded", String(!open));
        return;
      }
      const copyButton = target.closest<HTMLButtonElement>("[data-copy-bibtex]");
      if (copyButton) {
        const panel = copyButton.closest<HTMLElement>(".publication-bibtex");
        const code = panel?.querySelector("code")?.textContent ?? "";
        if (!code) return;
        const status = panel?.querySelector<HTMLElement>(".publication-copy-status");
        const copiedLabel = copyButton.dataset.copiedLabel ?? "Copied";
        const copy = async () => {
          if (!navigator.clipboard) {
            if (status) status.textContent = copyButton.dataset.copyUnavailable ?? "Clipboard unavailable";
            return;
          }
          try {
            await navigator.clipboard.writeText(code);
          } catch {
            if (status) status.textContent = copyButton.dataset.copyFailed ?? "Copy failed";
            return;
          }
          copyButton.textContent = copiedLabel;
          if (status) status.textContent = copiedLabel;
          window.setTimeout(() => {
            copyButton.textContent = copyButton.dataset.copyLabel ?? "Copy BibTeX";
            if (status) status.textContent = "";
          }, 1600);
        };
        void copy();
      }
    });
    publicationList.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAnnotations();
    });
    lightbox?.querySelector("[data-publication-lightbox-close]")?.addEventListener("click", closeLightbox);
    lightbox?.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  });
};
