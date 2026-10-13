---
locale: en
title: cookiecutter-scientific-research
description: A standardized, flexible template for scientific research projects supporting reproducible computing, uv, and Julia.
github: https://github.com/Vncntvx/cookiecutter-scientific-research
importance: 2
category: research
giscusComments: true
routeSlug: cookiecutter-scientific-research
---

# 🧪 Cookiecutter Scientific Research

<p align="center">
  <strong>A standardized, flexible template for scientific research projects</strong>
</p>

<p align="center">
  <a href="#project-overview">Project Overview</a> •
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#development-guide">Development Guide</a> •
  <a href="#acknowledgements">Acknowledgements</a> •
  <a href="#license">License</a>
</p>

<a id="project-overview"></a>

## 📋 Project Overview

Cookiecutter Scientific Research is a project template generator designed for scientific research projects, aimed at providing a standardized structure and tool configuration to help researchers focus on scientific discovery rather than project setup. Through predefined best practices, this template supports high-quality scientific computing and data analysis workflows, ensuring the reproducibility and reliability of the research process.

<a id="features"></a>

## ✨ Features

- **Dual Structure Modes** - `exploratory` (lightweight, script-first for rapid iteration) and `structured` (layered package for production pipelines)

- **Multi-Language Support** - Choose `python`, `julia`, or `both` (hybrid with Arrow/Parquet interchange)

- **Standardized Project Structure** - Conforms to best practices for modern scientific computing projects

- **Reproducible Experimental Environment** - Built-in environment management and dependency locking mechanisms

- **Integrated Documentation System** - Preconfigured MkDocs documentation for showcasing research results

- **Testing and Quality Control** - Built-in testing frameworks and code quality tools

- **Modern Package Management** - `uv` for Python, `Pkg` for Julia, with separated `make` targets (`lint-py`/`lint-jl`, `data-py`/`data-jl`, etc.)

<a id="quick-start"></a>

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- [uv](https://docs.astral.sh/uv/) or [pipx](https://pipx.pypa.io/stable/) (recommended for tool installation)

### Installation

This project is available on PyPI. As a cross-project tool, we recommend using uv or pipx for installation:

```bash
# Install using uv (recommended)
uv tool install cookiecutter-scientific-research

# Or install using pipx
pipx install cookiecutter-scientific-research
```

### Creating a New Project

After installation, simply run the following command and follow the prompts:

```bash
ccsr
```

### Initializing the Project Environment

After creating the project, navigate to the project directory and initialize the environment:

```bash
cd your-project-name

# Use uv to manage dependencies (recommended)
uv lock
uv sync
```

<a id="project-structure"></a>

## 📂 Project Structure

The generated project follows the directory structure below, with each section having a clear responsibility:

```
├── LICENSE            <- Project license
├── Makefile           <- Makefile with common commands
├── README.md          <- Project documentation
├── pyproject.toml     <- Project configuration and dependency management
│
├── data               <- Data directory
│   ├── external       <- Third-party data
│   ├── interim        <- Intermediate processed data
│   ├── processed      <- Final analysis datasets
│   └── raw            <- Original data (read-only)
│
├── {{ cookiecutter.module_name }}  <- Project source code (structured: 5 modules)
│   ├── __init__.py           <- Package initialization file
│   ├── config.py             <- Configuration parameter management
│   ├── data                  <- Data acquisition and loading
│   │   ├── __init__.py
│   │   └── make_dataset.py   <- raw → processed (Parquet)
│   ├── features              <- Feature engineering
│   │   ├── __init__.py
│   │   └── build_features.py <- Features from processed data
│   ├── models                <- Model training
│   │   ├── __init__.py
│   │   └── train_model.py    <- Train & persist model
│   ├── visualization         <- Data visualization
│   │   ├── __init__.py
│   │   └── visualize.py      <- Plots to reports/figures
│   └── utils                 <- Utility functions
│       ├── __init__.py
│       └── tools.py
│
├── notebooks          <- Jupyter/Marimo notebooks
│                         (Naming convention: number-creator-description)
│
├── docs               <- Project documentation (MkDocs)
│
├── references         <- Reference materials and literature
│
├── reports            <- Analysis reports and results
│   ├── figures        <- Generated charts
│   └── logs           <- Experiment logs
│
└── tests              <- Test directory
```

> **Two modes:** `structured` keeps the full tree above; `exploratory` keeps only `{{module}}/config.py` + `utils` + flat `scripts/` (Python) or `src/config.jl`+`utils.jl`+`scripts/` (Julia). With `project_language=julia` you get `Project.toml`+`src/` instead of `pyproject.toml`+`{{module}}/`; with `both` you get both trees and Arrow/Feather as interchange (`data/interim/*.arrow`). `make` targets are separated: `lint`/`lint-py` vs `lint-jl`, `data`/`data-py` vs `data-jl`, `create_environment` vs `create_environment-jl`, etc.

<a id="development-guide"></a>

## 🔧 Development Guide

### Package Management and Building

This project uses `flit_core` as the build backend, supporting modern Python package management. To build distribution packages:

```bash
# Install build dependencies
uv lock
# Install all optional dependencies
uv sync --all-extras
# Or install specific dependency groups
uv sync -e dev    # Development dependencies
uv sync -e test   # Testing dependencies
uv sync -e docs   # Documentation dependencies

# Build distribution packages
uv build
```

The built wheel files and source distribution packages will be saved in the `dist/` directory.

### Project Customization

During the template generation process, you can customize various aspects of the project according to prompts:

- **Project style** - `exploratory` (flat `scripts/` + minimal `config/utils`) vs `structured` (full layered package)
- **Programming language** - `python`, `julia`, or `both` (hybrid with `Project.toml` + `pyproject.toml`)
- Project name and module name
- Author information
- License type
- Dependency management method
- Test framework selection
- Notebook and linting choices
- And more

> `structured` now uses a slimmed 5-module scaffold (`data/features/models/visualization/utils`) — `make_dataset.py` / `build_features.py` / `train_model.py` / `visualize.py` each expose `def main(...)` for testable pipelines; `exploratory` keeps only `config.py` + `utils` (+ `scripts/01_*.py` linear scripts) for fast iteration. For Julia, `.jl` scaffold mirrors Python under `src/` (`make_dataset.jl` etc.) and `Project.toml` is committed (like `uv.lock`) for reproducibility. `cross_language.*` is only kept for `both`.

<a id="acknowledgements"></a>

## 🙏 Acknowledgements

This project is modified from [cookiecutter-data-science](https://github.com/drivendataorg/cookiecutter-data-science), special thanks to the DrivenData team for providing the excellent template and inspiration. The project has been customized for scientific research scenarios on the original basis, including tool chain optimization, workflow adjustments, and documentation structure optimization.

<a id="license"></a>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Vncntvx/cookiecutter-scientific-research/blob/master/LICENSE) file for details.
