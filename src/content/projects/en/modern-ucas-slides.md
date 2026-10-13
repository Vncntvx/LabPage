---
locale: en
title: modern-ucas-slides
description: A modern academic presentation slides template for the University of Chinese Academy of Sciences (UCAS) powered by Typst and Touying.
github: https://github.com/Vncntvx/modern-ucas-slides
importance: 2
category: typst
giscusComments: true
routeSlug: modern-ucas-slides
---

<h1 align="center">modern-ucas-slides</h1>

<p align="center">
  <a href="https://typst.app"><img src="https://img.shields.io/badge/Typst-0.15+-239dad.svg" alt="Typst"></a>
  <a href="https://github.com/touying-typ/touying"><img src="https://img.shields.io/badge/Touying-0.8.0-blue.svg" alt="Touying"></a>
  <a href="https://github.com/Vncntvx/modern-ucas-slides/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Vncntvx/modern-ucas-slides?style=flat-square" alt="License"></a>
</p>

A modern academic presentation slides template for the University of Chinese Academy of Sciences (UCAS), built with **[Typst](https://typst.app/)** and **[Touying (0.8.0)](https://github.com/touying-typ/touying)**.

It ships three visual styles (`academic`, `minimal`, and `bold`), supports both `16:9` widescreen and `4:3` traditional projector aspect ratios, and includes structured academic blocks, theorem and proof environments, normalized three-line tables, and bibliography management.

---

## Features

- **Three dedicated theme styles**:
  - `academic` (Official Elegance · Default): A 1.5pt UCAS Blue accent rule at the top, section breadcrumb navigation, the official circular emblem in the upper-right corner, and a structured metadata footer with author, title, date, and page number. Suited to proposal reports, mid-term reviews, and degree defenses.
  - `minimal` (Clean & Contemporary): A pure white layout with a compact chapter kicker at the top and a streamlined page number at the bottom, suited to seminars and international conference talks.
  - `bold` (Modern Tech): A colored reading-progress bar at the top, pill-shaped badge page numbers at the bottom, and full-bleed deep-blue section transition slides, suited to forward-looking lectures and technical deep dives.
- **Aspect ratio support**: Native support for `aspect-ratio: "16-9"` (default widescreen) and `"4-3"` (traditional projection), with page size and margins adapting automatically.
- **Structured block system**: Standard blocks (`tblock`), example blocks (`exampleblock`), alert blocks (`alertblock`), and callout bars (`callout`), each with page-break protection.
- **Academic typesetting environments**: Built-in theorem environments (`theorem`), proof environments (`proof`), unnumbered bottom footnotes (`blfootnote`), and normalized academic three-line tables.
- **Official vector emblems**: The UCAS official horizontal and circular vector emblems (SVG) are built in, with support for custom overrides or hiding.
- **Bibliography integration**: Supports BibTeX libraries and in-text `@key` citations.

---

## Quick Start

### 1. Install Typst

- **macOS (Homebrew)**:
  ```bash
  brew install typst
  ```
- **Windows (winget)**:
  ```bash
  winget install --id Typst.Typst
  ```
- **Linux / other platforms**:
  See the [official Typst installation guide](https://github.com/typst/typst/releases).

### 2. Compile & Preview

You can use the project's built-in Makefile targets:

```bash
# Compile to template/main.pdf
make compile

# Watch files and hot-reload (re-render on save)
make watch

# Compile and open the PDF in the system viewer
make preview

# Normalize code formatting
make format
```

You can also call the Typst CLI directly (note the `--root .` argument):

```bash
# Compile the main document
typst compile --root . template/main.typ

# Watch for changes
typst watch --root . template/main.typ

# Compile with the style overridden on the command line
typst compile --root . --input style=minimal template/main.typ
```

---

## Project Structure

```
modern-ucas-slides/
├── typst.toml                 # Typst package manifest
├── lib.typ                    # Template entry library (exports all themes and components)
├── themes/                    # Theme style engine
│   ├── colors.typ             # Theme palette
│   ├── header.typ             # Header layout function
│   ├── footer.typ             # Footer layout function
│   ├── preamble.typ           # Page title area rendering
│   ├── slide.typ              # Slide function and speaker-notes panel
│   └── ucas.typ               # Theme initialization entry
├── components/                # Page and typesetting components
│   ├── logo.typ               # Emblem vector rendering function
│   ├── cards.typ              # Cards and base blocks (tblock, exampleblock, alertblock)
│   ├── theorems.typ           # Theorem and proof environments (theorem, proof)
│   ├── callout.typ            # Callout bar (callout)
│   ├── helpers.typ            # Text emphasis and bottom footnotes (alert, blfootnote, red, green)
│   └── slides/                # Dedicated page components
│       ├── title.typ          # Title slide
│       ├── outline.typ        # Outline slide
│       ├── section.typ        # Section transition slide
│       └── ending.typ         # Closing slide
├── assets/
│   └── vi/                    # Official vector emblems (SVG)
├── template/                  # Template example directory
│   ├── main.typ               # Complete typesetting example and usage notes
│   └── ref.bib                # BibTeX bibliography
├── Makefile                   # Compile, watch, preview, and format build scripts
├── build.sh                   # Shell build helper script
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

---

## Configuration

In `template/main.typ`, parameters are configured through `#show: ucas-theme.with(...)`:

```typst
#import "../lib.typ": *

#show: ucas-theme.with(
  // 1. Style switch: "academic" (default) | "minimal" | "bold"
  style: "academic",

  // 2. Aspect ratio switch: "16-9" (default widescreen) | "4-3" (traditional projection)
  aspect-ratio: "16-9",

  // 3. Section transition slides: generate a transition slide for level-1 headings (default false)
  new-section-slide: false,

  // 4. Emblem configuration: uses the built-in vector emblem by default; pass a custom image or none
  logo: auto,

  // 5. Presentation metadata
  config-info(
    title: [UCAS Academic Slides in Typst],
    short-title: [modern-ucas-slides],
    subtitle: [Template Usage and Typesetting Example],
    author: [Wenjie Xu],
    short-author: [Wenjie Xu],
    institution: [University of Chinese Academy of Sciences · School of Computer Science and Technology],
    date: datetime.today(),
  ),
)

// --------------------------------- Page calls --------------------------------- //
#title-slide()    // Title slide
#outline-slide()  // Outline slide

= Chapter 1 Section Title
#slide(title: [Page Title])[
  Page body content
]

#ending-slide(title: [End of Presentation]) // Closing slide
```

---

## Syntax Quick Reference

| Feature                   | Example                                                        | Description                                                     |
| :------------------------ | :------------------------------------------------------------- | :-------------------------------------------------------------- |
| **Single-column slide**   | `#slide(title: [Title])[Content]`                              | Basic slide page                                                |
| **Multi-column layout**   | `#slide(composer: (1fr, 1.2fr))[Left][Right]`                  | Set column width ratios with `composer`                         |
| **Incremental reveal**    | `#pause`                                                       | Reveal elements step by step                                    |
| **Nested bullet list**    | `- Level 1 item`<br>`  - Level 2 item`<br>`    - Level 3 item` | Matches UCAS blue squares, dots, and dashes                     |
| **Nested numbered list**  | `+ Level 1 number`<br>`  + Level 2 number`                     | Auto-incrementing numbers                                       |
| **Standard block**        | `#tblock(title: [Title])[...]`                                 | Left accent bar with light gray background                      |
| **Example block**         | `#exampleblock(title: [Title])[...]`                           | For cases and data display                                      |
| **Alert block**           | `#alertblock(title: [Title])[...]`                             | For edge cases and cautions                                     |
| **Callout bar**           | `#callout(title: [Note])[...]`                                 | For summarizing points and hints                                |
| **Theorem environment**   | `#theorem(title: [Name])[...]`                                 | Theorem statement environment                                   |
| **Proof environment**     | `#proof[...]`                                                  | Derivation environment, with an automatic end-of-proof mark     |
| **Bottom footnote**       | `#blfootnote[...]`                                             | Anchored to the slide bottom without disturbing the body layout |
| **Bibliography citation** | `@key`                                                         | Pulls the entry from `ref.bib` automatically                    |
| **Bibliography list**     | `#bibliography("ref.bib", title: none)`                        | Generates the reference list automatically                      |

---

## License

This project is released under the [MIT License](https://github.com/Vncntvx/modern-ucas-slides/blob/main/LICENSE).
