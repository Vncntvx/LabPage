---
locale: zh-CN
title: cookiecutter-scientific-research
description: 面向科研项目的标准化、高灵活性脚手架模板，支持可复现实验环境、uv / Julia 包管理与规范文档构建。
github: https://github.com/Vncntvx/cookiecutter-scientific-research
importance: 2
category: research
giscusComments: true
routeSlug: cookiecutter-scientific-research
---

# 🧪 Cookiecutter Scientific Research

<p align="center">
  <strong>面向科研项目的标准化、高灵活性脚手架模板</strong>
</p>

<p align="center">
  <a href="#project-overview">项目概述</a> •
  <a href="#features">核心特性</a> •
  <a href="#quick-start">快速上手</a> •
  <a href="#project-structure">项目结构</a> •
  <a href="#development-guide">开发指南</a> •
  <a href="#acknowledgements">致谢</a> •
  <a href="#license">许可证</a>
</p>

<a id="project-overview"></a>

## 📋 项目概述

Cookiecutter Scientific Research 是专为科学研究项目设计的模板生成器，旨在提供标准化的工程结构与工具链配置，帮助研究人员专注于科学发现本身而非繁杂的环境搭建。通过预置的最佳实践，该模板全面支持高质量的科学计算与数据分析工作流，切实保障科研过程的可复现性与可靠性。

<a id="features"></a>

## ✨ 核心特性

- **双重架构模式** - `exploratory`（探索模式：轻量级、脚本优先，适用于快速实验原型迭代）与 `structured`（工程模式：分层包结构，适用于严谨的科研管线生产）

- **多语言原生支持** - 可选 `python`、`julia` 或 `both`（双语言混合协作，通过 Arrow/Parquet 高效交换数据）

- **标准化工程结构** - 深度契合现代科学计算项目的最佳实践与代码组织规范

- **可复现实验环境** - 内置严格的环境隔离、依赖版本锁定与可重现构建机制

- **集成化文档体系** - 预配置 MkDocs 文档框架，便于系统化展示研究方法论与实验成果

- **测试与质量控制** - 内置完备的代码质量检查、静态分析与单元测试框架

- **现代极速包管理** - Python 深度采用 `uv`，Julia 采用 `Pkg`，并提供细粒度的独立 `make` 指令（`lint-py`/`lint-jl`、`data-py`/`data-jl` 等）

<a id="quick-start"></a>

## 🚀 快速上手

### 环境准备

- Python 3.9 或更高版本
- [uv](https://docs.astral.sh/uv/) 或 [pipx](https://pipx.pypa.io/stable/)（推荐用于全局工具安装）

### 工具安装

本项目已发布至 PyPI。作为跨项目脚手架工具，推荐使用 uv 或 pipx 进行安装：

```bash
# 使用 uv 安装（推荐）
uv tool install cookiecutter-scientific-research

# 或使用 pipx 安装
pipx install cookiecutter-scientific-research
```

### 创建新项目

安装完成后，直接运行以下命令并按终端提示交互选择：

```bash
ccsr
```

### 初始化项目环境

生成项目后，进入项目目录并执行环境初始化：

```bash
cd your-project-name

# 使用 uv 进行依赖管理与环境锁定（推荐）
uv lock
uv sync
```

<a id="project-structure"></a>

## 📂 项目结构

生成的项目遵循以下清晰严谨的目录结构，各模块职责明确：

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

## 🔧 开发指南

### 包管理与构建打包

项目使用 `flit_core` 作为构建后端，支持标准现代 Python 打包。如需构建分发包：

```bash
# 安装构建依赖
uv lock
# 安装所有可选扩展依赖
uv sync --all-extras
# 或安装指定的依赖组
uv sync -e dev    # Development dependencies
uv sync -e test   # Testing dependencies
uv sync -e docs   # Documentation dependencies

# 构建源码分发包与 wheel 二进制包
uv build
```

构建生成的 wheel 文件和源码包将保存在 `dist/` 目录中。

### 项目深度定制

在模板生成过程中，您可以根据终端交互提示自由定制项目的各项配置：

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

## 🙏 致谢

本项目基于 [cookiecutter-data-science](https://github.com/drivendataorg/cookiecutter-data-science) 修改定制，特别感谢 DrivenData 团队提供的优秀模板与设计灵感。我们在原有基础上针对科学研究场景进行了深度定制，包括现代化工具链升级（uv/Julia）、科研工作流适配以及文档结构的针对性优化。

<a id="license"></a>

## 📄 许可证

本项目采用 MIT 许可证授权 - 详情参阅 [LICENSE](https://github.com/Vncntvx/cookiecutter-scientific-research/blob/master/LICENSE)。
