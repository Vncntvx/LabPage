---
locale: en
title: typush
description: Publish packages to the Typst Universe.
github: https://github.com/Vncntvx/typush
importance: 3
category: typst
giscusComments: true
routeSlug: typush
---

<div align="center">

# typush

</div>

typush is a CLI tool for developing, validating, and publishing [Typst](https://typst.app/) packages to the [Typst Universe](https://github.com/typst/packages).

The name combines Typst and push, referring to publishing packages to [universe](https://typst.app/universe/).

## Installation

Using Homebrew (macOS / Linux):

```sh
brew install Vncntvx/tap/typush
```

Using Go:

```sh
go install github.com/Vncntvx/typush@latest
```

Or download a prebuilt binary for your platform from [Releases](https://github.com/Vncntvx/typush/releases).

## Prerequisites

Commands like `publish universe` and `dev --check` rely on the [GitHub CLI](https://cli.github.com). Install `gh` and run `gh auth login` once; run `typush login universe` to verify your authentication status.

## Quick start

Initialize a new package:

```sh
typush init
```

Link the directory into `@preview` during local development:

```sh
typush dev
```

Publish to Universe:

```sh
typush publish universe
```

For complete command references and workflows, see the [User Guide](https://github.com/Vncntvx/typush/blob/main/docs/guide.en.md).

## Commands

```sh
typush --help
typush init [name]                                             # interactively create typst.toml, README.md, LICENSE, and entrypoint
typush bump [patch|minor|major|<ver>] [-i files] [-t tag] [-n] # bump package version (supports -i extra files and -n dry-run)
typush check [--local] [--no-compile]                          # run package specifications and compiler checks
typush list [namespace] [-a] [-t] [--json]                     # list installed packages (-a includes cache, -t shows tree)
typush install <ns> [-n]                                       # install to a local namespace (supports -n dry-run)
typush uninstall <target> [-y] [-n]                            # remove installed packages (version, package, or namespace)
typush clone <package> [dest] [-f] [-n]                        # download Universe package source and extract locally
typush download <repo> [-c ref] [-n ns] [--subdir dir] [...]  # clone and install from a git repository (supports subdirectories)
typush dev [--check]                                           # link into @preview (fast conflict check via official CDN)
typush dev list                                                # list active dev links in @preview and target paths
typush clean [package] [-n]                                    # remove dev symlinks from @preview (supports -n dry-run)
typush search <query> [--limit 20] [--json]                    # search packages on Universe
typush info <package>[:version] [--json]                       # view package metadata and version history
typush outdated [path] [--json]                                # check for outdated dependencies in .typ files
typush update [package...] [-n] [--file path]                  # update package dependencies in .typ files (supports -n dry-run)
typush metadata [field] [--json]                               # inspect package metadata (single field or JSON)
typush path [namespace]                                        # show local Typst packages directory path
typush completion <bash|zsh|fish|powershell>                   # generate shell completion scripts
typush exclude <globs...> [-n]                                 # add glob patterns to excluded files (supports -n dry-run)
typush login universe                                          # verify GitHub CLI authentication
typush publish universe [-n]                                   # validate and submit a PR to Universe (supports -n dry-run)
typush pr status [number|url]                                  # view PR details and review comments (matches current package by default)
typush pr checks [number|url] [-w]                             # view or watch official Universe CI check runs
typush ci plan [--packages "a b"]                              # scan workspace and output CI matrix JSON
typush ci generate [...] [-n]                                  # generate GitHub Actions CI release workflow (supports -n dry-run)
```

`publish` runs Universe checks locally before opening a pull request. It catches missing metadata, invalid SPDX licenses, author formatting issues, forbidden file exclusions, and missing assets.

## Local verification

When `typst` is found on your `PATH` (or specified by `TYPST_BIN`), `typush check` runs the official CI verification steps:

- Compile: for libraries, imports the package; for templates, runs `typst init @preview/<name>:<version>` in an isolated temporary directory and compiles the template entrypoint. Compilation never touches your local Typst data. Use `--no-compile` to skip compilation, or `--local` to check only basic manifest rules.
- README: checks for missing image alt text, broken relative links, unsupported markdown features, and repository URLs pointing to mutable default branches.
- Files: flags bundled font files, unexcluded test/example files or large files, and unlinked manuals.
- Imports: flags relative imports of the entrypoint, outdated version references, and non-standard template imports.

## Development

```sh
go build ./...
go test ./...
go vet ./...
gofmt -l .
```

## License

[MIT](https://github.com/Vncntvx/typush/blob/main/LICENSE)
