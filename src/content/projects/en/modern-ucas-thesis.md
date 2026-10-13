---
locale: en
title: modern-ucas-thesis
description: A Thesis/Dissertation Template for University of Chinese Academy of Sciences in Typst.
image: typstUCAS.png
github: https://github.com/Vncntvx/modern-ucas-thesis
importance: 1
category: typst
giscusComments: true
routeSlug: modern-ucas-thesis
---

<h1 align="center">modern-ucas-thesis</h1>

<p align="center">
  <img src="https://img.shields.io/badge/status-beta-blue?style=flat-square" alt="Project Status">
  <img src="https://img.shields.io/github/last-commit/Vncntvx/modern-ucas-thesis?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/github/issues/Vncntvx/modern-ucas-thesis?style=flat-square" alt="Issues">
  <img src="https://img.shields.io/github/license/Vncntvx/modern-ucas-thesis?style=flat-square" alt="License">
</p>

A [Typst](https://typst.app/)-based thesis template for the University of Chinese Academy of Sciences (UCAS), following the _UCAS Graduate Thesis Writing Guidelines (2022)_ and the _UCAS Undergraduate Thesis (Design) Writing Guidelines (2023-10 revision)_.

> ⚠️ **Disclaimer**: This project is not officially produced. Verify the latest format requirements from the university before use.

---

## Quick Start

### 1. Install Typst

```bash
# macOS
brew install typst

# Windows
winget install --id Typst.Typst

# Or use the official installation script
curl -fsSL https://typst.community/install | sh
```

### 2. Use the Project

```bash
# Clone the repository
git clone https://github.com/Vncntvx/modern-ucas-thesis.git
cd modern-ucas-thesis

# Compile the thesis
typst compile template/thesis.typ --root . --font-path fonts

# Compile the research proposal (shared entry for bachelor/master; see template/proposal.typ)
typst compile template/proposal.typ --root . --font-path fonts

# Or enable live preview
typst watch template/thesis.typ --root . --font-path fonts
```

### 3. Configure Thesis Information

Edit `template/thesis.typ`:

```typst
#import "../lib.typ": documentclass

#let (
  doc, preface, mainmatter, appendix,
  cover, decl-page, abstract, abstract-en,
  outline-page, list-of-figures-and-tables, notation,
  bilingual-bibliography, acknowledgement, backmatter,
  bifigure, bitable, continued-table, auto-table, aligned-equation,
) = documentclass(
  doctype: "doctor",       // "bachelor" | "master" | "doctor"
  degree: "academic",      // "academic" | "professional"
  anonymous: false,        // Blind-review mode
  twoside: true,           // Double-sided printing mode
  fontset: "mac",          // "windows" | "mac" | "fandol" | "adobe"
  info: (
    title: ("Thesis Title", "Optional Subtitle"),
    title-en: "Thesis Title",
    author: "San Zhang",
    author-en: "Zhang San",
    // Supervisors: a list of dicts (name:, title:, affiliation:); the first supervisor comes first
    supervisors: (
      (name: "Si Li", title: "Professor", affiliation: "Institute of XXX, Chinese Academy of Sciences"),
      (name: "Wu Wang", title: "Professor", affiliation: "Institute of XXX, Chinese Academy of Sciences"),
    ),
    supervisors-en: (
      (name: "Si Li", title: "Professor", affiliation: "Institute of XXX, Chinese Academy of Sciences"),
      (name: "Wu Wang", title: "Professor", affiliation: "Institute of XXX, Chinese Academy of Sciences"),
    ),
    department: "Institute of XXX, Chinese Academy of Sciences",
    major: "Management Science and Engineering",
    category: "Doctor of Management",
    submit-date: datetime(year: 2024, month: 6, day: 1),
  ),
  bibliography: bibliography.with("ref.bib"),
)

#show: doc
#cover()
#decl-page()
#show: preface
// Abstract, outline, notation list, ...
#show: mainmatter
// Main text, ...
```

---

## Project Structure

```text
modern-ucas-thesis/
├── template/              # Thesis and research proposal sources (template entry)
│   ├── thesis.typ        # Thesis main file
│   ├── proposal.typ      # Research-proposal main file
│   ├── ref.bib           # Bibliography (shared by the thesis and the proposal)
│   └── images/           # Image directory
├── pages/                # Page implementations (cover, declaration, abstract, outline, proposal, etc.)
├── layouts/              # Page-level layouts (doc / preface / mainmatter / appendix)
├── utils/                # Reusable utilities (bilingual figures/tables, continued tables, aligned equations, fonts, numbering, etc.)
├── assets/               # Static assets (UCAS visual identity, etc.)
├── fonts/                # Font directory (place font files yourself; see fonts/README.md)
├── docs/                 # Documentation (guideline texts, customization guide, FAQ, etc.)
├── lib.typ               # Main library entry (documentclass / proposalclass closure factories)
├── typst.toml            # Typst package manifest
└── Makefile              # Formatting and check scripts
```

---

## Features

> Implementation status is checked item by item against _UCAS Graduate Thesis Writing Guidelines (2022)_ in `docs/RULES-GRAD.md`. Status legend: ✅ Completed | 🟡 Partial / needs polish | ❌ Not started | ➖ Not required by the guidelines.

### Document Configuration

| Feature                                                        | Status | Guideline basis / notes                                                    |
| -------------------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| Global configuration (document type, degree type, fonts, etc.) | ✅     | Injected through the `documentclass` closure factory                       |
| Blind-review mode                                              | ✅     | `anonymous: true` automatically hides author/supervisor and related fields |
| Double-sided printing mode                                     | ✅     | `twoside: true` inserts blank pages so every part starts on an odd page    |

### Cover and Front Matter

| Feature                                         | Status | Guideline basis / notes                                                                                                                                        |
| ----------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Graduate cover (Chinese/English; master/doctor) | ✅     | Title in Heiti 小三 bold, fields in Songti 四号 bold with double line spacing, date in Times New Roman 四号 bold                                               |
| Undergraduate cover                             | ✅     | Implemented in `bachelor-cover.typ`, dispatched by `doctype`                                                                                                   |
| Spine                                           | 🟡     | Required by the guidelines: Heiti 小四; top = title, middle = author, bottom = "University of Chinese Academy of Sciences"; 3 cm from the top and bottom edges |
| Originality statement and authorization         | ✅     | Implemented for both graduate and undergraduate (unified statement template, sample 3)                                                                         |
| Chinese abstract (with keywords)                | ✅     | "摘　要" with a blank character between the two characters; Heiti 四号 bold centered; 3–5 keywords separated by Chinese commas                                 |
| English abstract (with keywords)                | ✅     | "Key Words" bold, initial capitals, English commas                                                                                                             |
| Table of contents                               | ✅     | Indented to level 3 (level 1 flush, level 2 one character, level 3 two characters), page numbers right-aligned                                                 |
| List of figures and tables                      | ✅     | Figures first, then tables; placed after the TOC on a new page                                                                                                 |
| Notation list (terms and symbols)               | ✅     | Placed after the TOC and before the main text, on a new page                                                                                                   |

### Main Text Typesetting

| Feature                                              | Status | Guideline basis / notes                                                                                                                                                 |
| ---------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chapter heading numbering                            | ✅     | Arabic numerals to level 3 (at most level 4); chapters centered as "第1章", subsections flush left as "1.1 / 1.1.1"                                                     |
| Headers                                              | ✅     | Odd pages = current chapter/part name, even pages = thesis title; Songti 小五 centered with a rule below                                                                |
| Page numbering                                       | ✅     | Front matter in centered uppercase Roman numerals; main text defaults to `twoside: true`, odd pages bottom-right and even pages bottom-left, centered when single-sided |
| Footnotes                                            | ✅     | 五号 Songti, counter resets at chapter/part starts                                                                                                                      |
| Endnotes                                             | ➖     | Not required by the guidelines                                                                                                                                          |
| Cross-references (figures/tables/equations/sections) | ✅     | Unified prefixes: `@fig:` / `@tbl:` / `@eqt:`                                                                                                                           |
| Paragraph format                                     | ✅     | 小四 Songti, 1.25× line spacing, 2-character first-line indent, justified                                                                                               |
| Code block syntax highlighting                       | ✅     | Native Typst raw block support                                                                                                                                          |

### Figures and Tables

| Feature                                                 | Status | Guideline basis / notes                                                                                                            |
| ------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Bilingual figure/table captions                         | ✅     | Figure captions below the figure, table captions above the table; 五号 Songti bold centered, 1.25× line spacing                    |
| Figure/table notes                                      | ✅     | "注：" bold, left-indented 2 characters, continuation lines aligned                                                                |
| Chapter-based figure/table numbering                    | ✅     | In the form `图1-1`, `表3-2`, numbered continuously within each chapter                                                            |
| Automatic continued tables (long tables spanning pages) | ✅     | `auto-table` breaks pages proactively, repeats the header, and labels "续表"/"(continued)"                                         |
| Manual continued tables                                 | ✅     | `continued-table` must be used together with the source table label                                                                |
| Appendix figure/table numbering                         | ✅     | Reuses the main-text numbering form (`1-1`), matching the guideline clause that appendix figures/tables follow main-text numbering |
| Three-line tables                                       | ✅     | `auto-table` defaults to three-line tables; `table`/`bitable` can write them by hand with `table.hline()`                          |
| Landscape tables                                        | ✅     | `bitable`/`bifigure`/`auto-table` support `landscape: true`, rotated 90° counterclockwise, oriented "top-left, bottom-right"       |
| Map approval-number note helper                         | 🟡     | The guidelines require border maps to note "审图号 GS(2021)××××号"; the user must add it manually                                  |

### Equations and Math

| Feature                                     | Status | Guideline basis / notes                                                |
| ------------------------------------------- | ------ | ---------------------------------------------------------------------- |
| Display equation numbering                  | ✅     | Number inside parentheses, right-aligned                               |
| Multi-line equation alignment and numbering | ✅     | `aligned-equation` aligns the number to the right of the last line     |
| Chapter-based equation numbering            | ✅     | In the form `(3-1)`, numbered continuously within each chapter         |
| Unnumbered equations                        | ✅     | Tagged with `<->`                                                      |
| Appendix equation numbering                 | ✅     | In the form `(1-1)`, reusing the main-text numbering form              |
| Long equation line breaks                   | ✅     | Break after `+ - × ÷ < >` and similar operators (native Typst support) |
| Theorem/lemma/proof environments            | ➖     | Not required by the guidelines                                         |

### References

| Feature                                    | Status | Guideline basis / notes                                                                                          |
| ------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------- |
| Bilingual bibliography title               | ✅     | Chinese "参考文献"; the English title is handled automatically                                                   |
| GB/T 7714-2015 (numeric)                   | ✅     | Default `gb-7714-2015-numeric`                                                                                   |
| GB/T 7714-2015 (author–date)               | 🟡     | Switchable via `style: "gb-7714-2015-author-date"`, but no default configuration or style validation is provided |
| Automatic Chinese/English entry conversion | ✅     | Detects the language of an entry and converts terms such as 等/卷/册/译/版                                       |
| Citations and cross-references             | ✅     | `@citekey`                                                                                                       |

### Appendix and Back Matter

| Feature                                    | Status | Guideline basis / notes                                                                                                   |
| ------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| Appendix chapters                          | ✅     | Level-1 headings unnumbered, subsections `1.1`, figures/tables `1-1`, equations `(1-1)`                                   |
| Acknowledgements                           | ✅     | A blank character between 致 and 谢 in the title; a date at the end matching the cover                                    |
| Author biography and academic achievements | ✅     | Education/work history, paper list (in the same format as references), patents, projects, and awards                      |
| Degree-category bilingual table            | 🟡     | Attachment 2 of the guidelines; present only as an example table in `thesis.typ`, not extracted into a reusable component |

### Fonts and Typesetting

| Feature                          | Status | Guideline basis / notes                                                                       |
| -------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| Predefined font sets             | ✅     | Four sets — `windows` / `mac` / `fandol` / `adobe` — covering Song/Hei/Kai/FangSong/monospace |
| Custom font configuration        | ✅     | The `fonts` parameter overrides individual `fontset` entries                                  |
| Chinese–Western mixed typography | ✅     | Chinese Songti/Heiti etc. plus English Times New Roman                                        |
| CJK faux bold                    | ✅     | Enabled through `@preview/cuti:0.4.0` for non-fandol font sets                                |

### Other Document Types

| Feature                               | Status | Guideline basis / notes                                                                                                  |
| ------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| Undergraduate research proposal       | ✅     | `template/proposal.typ` with `proposalclass(doctype: "bachelor")`; layout currently matches the graduate version         |
| Graduate research proposal            | ✅     | `template/proposal.typ` with `proposalclass(doctype: "master")`; styles live in `pages/proposal.typ`                     |
| Proposal heading numbering and indent | ✅     | Headings `1.` / `1.1.` / `1.1.2`, body first-line indent 2em                                                             |
| Proposal bibliography                 | ✅     | Shares `bilingual-bibliography` and `template/ref.bib` with the thesis                                                   |
| Proposal supervisor field             | ✅     | Required: provide exactly one of `supervisors-full` or `supervisors-split`; providing both or neither is a compile error |

---

## Documentation

- [Graduate Writing Guidelines (Chinese)](https://github.com/Vncntvx/modern-ucas-thesis/blob/main/docs/RULES-GRAD.md) (_UCAS Graduate Thesis Writing Guidelines_, 2022)
- [Undergraduate Writing Guidelines (Chinese)](https://github.com/Vncntvx/modern-ucas-thesis/blob/main/docs/RULES-BACHELOR.md) (_UCAS Undergraduate Thesis (Design) Writing Guidelines_, 2023-10 revision)
- [Customization Guide](https://github.com/Vncntvx/modern-ucas-thesis/blob/main/docs/CUSTOMIZE.md)
- [FAQ](https://github.com/Vncntvx/modern-ucas-thesis/blob/main/docs/FAQ.md)
- [Formatting Tools](https://github.com/Vncntvx/modern-ucas-thesis/blob/main/docs/FORMAT.md)
- [UCAS Logo Copyright](https://github.com/Vncntvx/modern-ucas-thesis/blob/main/docs/LOGO_COPYRIGHT.md)

---

## Development

```bash
# Format code (requires typstyle)
make format           # Format all .typ files
make format-check     # Check only, no writes; the CI gate
make lint-quick       # Check typst.toml fields and the entry point; no external index
```

---

## Acknowledgements

- Built on [modern-nju-thesis](https://github.com/nju-lug/modern-nju-thesis)
- References the [ucasthesis](https://github.com/mohuangrui/ucasthesis) LaTeX template

---

## License

The code of this project is open-sourced under the [MIT](https://github.com/Vncntvx/modern-ucas-thesis/blob/main/LICENSE) License.

**About the UCAS logo**: The visual identity elements in the `assets/vi/` directory, including the university emblem and logo, are copyrighted by the University of Chinese Academy of Sciences. They are included in this project solely for the convenience of users writing degree theses (within the scope of personal learning/teaching fair use). Do not use them for other commercial or official purposes. For commercial licensing, contact the relevant university departments. See [LOGO_COPYRIGHT.md](https://github.com/Vncntvx/modern-ucas-thesis/blob/main/docs/LOGO_COPYRIGHT.md) for details.

---

<p align="center">
  <a href="https://github.com/Vncntvx/modern-ucas-thesis/issues">Report Issues</a> ·
  <a href="https://github.com/Vncntvx/modern-ucas-thesis/discussions">Discussions</a> ·
  <a href="https://github.com/Vncntvx/modern-ucas-thesis/pulls">Contribute</a>
</p>
