# 自定义指南

本文档提供网站自定义的实用指南。重要提示：**所有更改都应在仓库的 `main` 分支上进行**。每次修改 `main` 分支时，`gh-pages` 分支会自动被覆盖。

> 本项目基于 [al-folio](https://github.com/alshedivat/al-folio) 主题，针对学术个人网站进行了深度定制和扩展，特别是增加了完整的多语言国际化（i18n）支持。

<!--ts-->

- [自定义指南](#自定义指南)
  - [项目结构](#项目结构)
  - [配置文件](#配置文件)
  - [多语言国际化（i18n）](#多语言国际化i18n)
    - [支持的语言](#支持的语言)
    - [配置说明](#配置说明)
    - [目录结构](#目录结构)
    - [创建多语言内容](#创建多语言内容)
    - [语言切换](#语言切换)
    - [日期格式本地化](#日期格式本地化)
    - [翻译字符串管理](#翻译字符串管理)
  - [技术栈](#技术栈)
    - [前端](#前端)
    - [后端](#后端)
    - [构建与部署](#构建与部署)
  - [修改简历信息](#修改简历信息)
    - [RenderCV 格式（推荐）](#rendercv-格式推荐)
    - [JSONResume 格式](#jsonresume-格式)
    - [同时使用两种格式](#同时使用两种格式)
    - [自动生成 PDF（仅 RenderCV）](#自动生成-pdf仅-rendercv)
  - [修改用户和仓库信息](#修改用户和仓库信息)
    - [配置外部服务 URL](#配置外部服务-url)
  - [创建新页面](#创建新页面)
  - [创建博客文章](#创建博客文章)
  - [外部博客文章同步](#外部博客文章同步)
  - [创建新项目](#创建新项目)
  - [添加动态消息](#添加动态消息)
  - [创建研究页面](#创建研究页面)
  - [创建工具箱页面](#创建工具箱页面)
  - [创建下拉菜单](#创建下拉菜单)
  - [添加集合](#添加集合)
    - [创建新集合](#创建新集合)
    - [在集合中使用 Frontmatter 字段](#在集合中使用-frontmatter-字段)
    - [创建教学集合](#创建教学集合)
      - [课程文件格式](#课程文件格式)
      - [课程集合注意事项](#课程集合注意事项)
      - [必填字段](#必填字段)
      - [可选字段](#可选字段)
    - [Jupyter Notebook 支持](#jupyter-notebook-支持)
    - [带分类和标签的集合](#带分类和标签的集合)
    - [创建自定义元数据组和归档页](#创建自定义元数据组和归档页)
      - [理解 Jekyll 对字段的处理](#理解-jekyll-对字段的处理)
      - [示例：添加自定义「改编」字段](#示例添加自定义改编字段)
      - [字段命名最佳实践](#字段命名最佳实践)
  - [添加新出版物](#添加新出版物)
    - [作者标注](#作者标注)
      - [多语言作者姓名](#多语言作者姓名)
      - [中文出版物](#中文出版物)
    - [按钮（通过自定义 BibTeX 关键词）](#按钮通过自定义-bibtex-关键词)
    - [出版物预览图](#出版物预览图)
    - [出版物徽章](#出版物徽章)
    - [期刊/会议缩写](#期刊会议缩写)
    - [注释和高亮](#注释和高亮)
    - [出版物分组和筛选](#出版物分组和筛选)
      - [按年份](#按年份)
      - [按类型](#按类型)
      - [精选出版物](#精选出版物)
    - [完整 BibTeX 字段参考](#完整-bibtex-字段参考)
    - [完整示例](#完整示例)
    - [文件组织](#文件组织)
    - [故障排除](#故障排除)
  - [更改主题颜色](#更改主题颜色)
  - [功能开关](#功能开关)
    - [深色模式](#深色模式)
    - [滚动进度条](#滚动进度条)
    - [工具提示](#工具提示)
    - [图片缩放](#图片缩放)
    - [Masonry 布局](#masonry-布局)
  - [自定义布局和界面](#自定义布局和界面)
  - [添加社交媒体信息](#添加社交媒体信息)
  - [添加订阅](#添加订阅)
  - [配置搜索功能](#配置搜索功能)
  - [社交媒体预览](#社交媒体预览)
    - [启用方法](#启用方法)
    - [配置预览图](#配置预览图)
    - [预览图最佳实践](#预览图最佳实践)
  - [相关文章](#相关文章)
    - [工作原理](#工作原理)
    - [配置](#配置)
    - [禁用特定文章的相关推荐](#禁用特定文章的相关推荐)
  - [管理出版物显示](#管理出版物显示)
  - [评论系统](#评论系统)
    - [Giscus 评论（推荐）](#giscus-评论推荐)
    - [Disqus 评论](#disqus-评论)
  - [添加 Google 日历](#添加-google-日历)
    - [基本用法](#基本用法)
    - [为页面启用日历脚本](#为页面启用日历脚本)
    - [可选：自定义日历样式](#可选自定义日历样式)
  - [使用第三方库](#使用第三方库)
    - [图表库](#图表库)
      - [Chart.js](#chartjs)
      - [ECharts](#echarts)
      - [Plotly](#plotly)
      - [Vega/Vega-Lite](#vegavega-lite)
    - [地图功能](#地图功能)
      - [Leaflet 地图](#leaflet-地图)
    - [灯箱库](#灯箱库)
      - [Photoswipe](#photoswipe)
      - [Lightbox2](#lightbox2)
      - [Venobox](#venobox)
      - [Spotlight](#spotlight)
    - [图片功能](#图片功能)
      - [图片轮播](#图片轮播)
      - [图片对比](#图片对比)
    - [其他功能](#其他功能)
      - [伪代码](#伪代码)
      - [Mermaid 图表](#mermaid-图表)
  - [更新第三方库](#更新第三方库)
  - [删除内容](#删除内容)
    - [删除博客页面](#删除博客页面)
    - [删除动态消息区域](#删除动态消息区域)
    - [删除项目页面](#删除项目页面)
    - [删除出版物页面](#删除出版物页面)
    - [删除仓库页面](#删除仓库页面)
    - [通过注释 Frontmatter 块禁用页面](#通过注释-frontmatter-块禁用页面)
  - [为 Lighthouse Badger 添加 Token](#为-lighthouse-badger-添加-token)
    - [Lighthouse Badger 的个人访问令牌（精细粒度）权限](#lighthouse-badger-的个人访问令牌精细粒度权限)
  - [图片功能](#图片功能-1)
    - [响应式图片](#响应式图片)
    - [懒加载图片](#懒加载图片)
    - [图片缩放](#图片缩放-1)
    - [图片灯箱](#图片灯箱)
  - [自定义字体、间距等](#自定义字体间距等)
  - [定时发布](#定时发布)
    - [文件名格式](#文件名格式)
    - [重要说明](#重要说明)
  - [分析工具](#分析工具)
    - [Google Analytics (GA4)](#google-analytics-ga4)
    - [Cronitor RUM](#cronitor-rum)
    - [Pirsch Analytics](#pirsch-analytics)
    - [Openpanel Analytics](#openpanel-analytics)
    - [站点验证](#站点验证)
      - [Google Search Console](#google-search-console)
      - [Bing Webmaster Tools](#bing-webmaster-tools)
  - [GDPR Cookie 同意对话框](#gdpr-cookie-同意对话框)
    - [工作原理](#工作原理-1)
    - [使用场景](#使用场景)
    - [启用方法](#启用方法-1)
    - [自定义同意对话框](#自定义同意对话框)
    - [支持的分析提供商](#支持的分析提供商)
    - [与分析工具集成](#与分析工具集成)
    - [开发者指南](#开发者指南)
  - [为 Google Scholar 引用更新设置个人访问令牌](#为-google-scholar-引用更新设置个人访问令牌)
    - [为什么需要 PAT](#为什么需要-pat)
    - [如何设置 PAT](#如何设置-pat)

<!--te-->

## 项目结构

项目主要结构如下，重点列出需要修改的组件：

```txt
.
├── 📂 assets/: 网站资源文件
│   ├── 📂 json/
│   │   └── 📄 resume.json: JSON 格式简历 (https://jsonresume.org/)
│   └── 📂 rendercv/
│       ├── 📄 design.yaml: RenderCV 设计样式
│       ├── 📄 locale.yaml: RenderCV 本地化配置
│       └── 📄 settings.yaml: RenderCV 设置
├── 📂 _bibliography/
│   └── 📄 papers.bib: BibTeX 格式参考文献
├── 📂 _books/: 书架页面
│   ├── 📂 zh_CN/: 中文书评
│   ├── 📂 en_US/: 英文书评
│   ├── 📂 de_DE/: 德文书评
│   └── 📂 ja_JP/: 日文书评
├── 📄 _config.yml: 模板配置文件
├── 📂 _data/: 模板数据文件
│   ├── 📄 apps.yml: Web 应用展示配置
│   ├── 📄 citations.yml: Google Scholar 引用数据
│   ├── 📄 coauthors.yml: 合作者信息
│   ├── 📄 cv.yml: YAML 格式简历（resume.json 不存在时使用）
│   ├── 📄 repositories.yml: YAML 格式用户和仓库信息
│   ├── 📄 socials.yml: YAML 格式社交媒体和联系信息
│   ├── 📄 venues.yml: 会议/期刊场地信息
│   └── 📂 {lang}/: 语言特定数据
│       ├── 📄 strings.yml: 界面文本翻译
│       ├── 📄 cv.yml: RenderCV 格式简历
│       └── 📄 toolbox.yml: 工具箱配置
├── 📂 _includes/: 可复用的代码片段
│   ├── 📂 cv/: 简历组件 (16 个文件)
│   ├── 📂 repository/: GitHub 仓库组件 (4 个文件)
│   └── 📄 其他组件
├── 📂 _layouts/: 页面布局模板
├── 📂 _news/: 关于页面动态消息
│   ├── 📂 zh_CN/: 中文新闻
│   ├── 📂 en_US/: 英文新闻
│   ├── 📂 de_DE/: 德文新闻
│   └── 📂 ja_JP/: 日文新闻
├── 📂 _pages/: 网站页面
│   ├── 📂 zh_CN/: 中文页面
│   ├── 📂 en_US/: 英文页面
│   ├── 📂 de_DE/: 德文页面
│   └── 📂 ja_JP/: 日文页面
├── 📂 _posts/: 博客文章
├── 📂 _projects/: 项目
│   ├── 📂 zh_CN/: 中文项目
│   ├── 📂 en_US/: 英文项目
│   ├── 📂 de_DE/: 德文项目
│   └── 📂 ja_JP/: 日文项目
├── 📂 _sass/: 网站样式文件
│   ├── 📂 font-awesome/: Font Awesome SCSS 文件
│   ├── 📄 _blog.scss: 博客、标签和分页样式
│   ├── 📄 _components.scss: 可复用组件样式
│   ├── 📄 _cv.scss: 简历页面样式
│   ├── 📄 _distill.scss: Distill 文章样式
│   ├── 📄 _footer.scss: 页脚样式
│   ├── 📄 _layout.scss: 整体布局样式
│   ├── 📄 _navbar.scss: 导航栏和下拉菜单样式
│   ├── 📄 _publications.scss: 出版物列表和参考文献样式
│   ├── 📄 _tabs.scss: 标签页样式
│   ├── 📄 _teachings.scss: 课程和教学样式
│   ├── 📄 _themes.scss: 主题颜色和图标
│   ├── 📄 _typograms.scss: Typogram 图表样式
│   ├── 📄 _typography.scss: 文本、标题、链接、表格和引用样式
│   ├── 📄 _utilities.scss: 工具样式
│   └── 📄 _variables.scss: SCSS 变量
└── 📂 _scripts/: JavaScript 脚本
```

## 配置文件

主配置文件为 [`_config.yml`](_config.yml)，包含网站的主要配置。大多数设置都配有注释。

> 注意：`url` 和 `baseurl` 设置用于生成网站链接。
>
> - **个人站点**：`url: https://username.github.io` + `baseurl:`（空）
> - **项目站点**：`url: https://username.github.io` + `baseurl: /repo-name/`

修改此文件后需要重新构建网站才能生效。本地开发需重新运行 `bundle exec jekyll serve`，GitHub Pages 则需推送更改。其他更改刷新页面即可生效。

如果刷新后更改仍未显示，尝试：

- **强制刷新**（忽略缓存）：
  - Chromium 浏览器：`Shift + F5`
  - Firefox 浏览器：`Ctrl + F5`
- **清除浏览器缓存**
- **使用隐私/无痕窗口**确保无缓存内容

## 多语言国际化（i18n）

本项目使用 `jekyll-polyglot` 插件提供完整的多语言支持，支持通过路径自动识别语言，并提供语言切换功能。

### 支持的语言

当前支持以下 4 种语言：

| 语言代码 | 语言名称 | 说明     |
| -------- | -------- | -------- |
| `zh_CN`  | 中文     | 默认语言 |
| `en_US`  | English  | 英文     |
| `de_DE`  | Deutsch  | 德文     |
| `ja_JP`  | 日本語   | 日文     |

### 配置说明

多语言配置位于 [`_config.yml`](_config.yml)：

```yaml
languages: ["en_US", "zh_CN", "de_DE", "ja_JP"]
default_lang: "zh_CN"
lang_from_path: true
parallel_localization: false
country_flag: false
language_names:
  en_US: "English"
  zh_CN: "中文"
  de_DE: "Deutsch"
  ja_JP: "日本語"
exclude_from_localization: ["assets", "sitemap.xml", "feed.xml", "robots.txt"]
```

**配置参数说明：**

- `languages`: 支持的语言列表
- `default_lang`: 默认语言（网站根目录显示的语言）
- `lang_from_path`: 从 URL 路径识别语言（例如 `/en_US/` 表示英文）
- `parallel_localization`: 是否并行处理本地化（设为 false 以兼容 LSI）
- `country_flag`: 是否显示国旗图标（默认不显示）
- `language_names`: 语言显示名称映射
- `exclude_from_localization`: 不需要本地化的文件/目录

**重要提示：** 由于 `jekyll-polyglot` 插件冲突，必须设置 `lsi: false`（相关文章推荐功能禁用）。

### 目录结构

多语言内容按语言代码组织在独立目录中：

```
_pages/
├── zh_CN/          # 中文页面（15个文件）
│   ├── about.md
│   ├── blog.md
│   ├── projects.md
│   └── ...
├── en_US/          # 英文页面（15个文件）
│   ├── about.md
│   ├── blog.md
│   └── ...
├── de_DE/          # 德文页面
└── ja_JP/          # 日文页面

_news/
├── zh_CN/          # 中文新闻
├── en_US/          # 英文新闻
├── de_DE/
└── ja_JP/

_projects/
├── zh_CN/
├── en_US/
├── de_DE/
└── ja_JP/

_books/
├── zh_CN/
├── en_US/
├── de_DE/
└── ja_JP/
```

### 创建多语言内容

为每种语言创建对应的内容文件：

1. **页面内容**：在 `_pages/{lang}/` 目录下创建
2. **新闻/博客**：在 `_news/{lang}/` 或 `_posts/` 目录下创建
3. **项目**：在 `_projects/{lang}/` 目录下创建
4. **书评**：在 `_books/{lang}/` 目录下创建

**示例：** 创建中文和英文的关于页面

- 中文：`_pages/zh_CN/about.md`
- 英文：`_pages/en_US/about.md`

两个文件使用相同的布局和 permalink，但内容使用不同的语言。

### 语言切换

导航栏自动显示语言切换器：

- **双语言模式**：显示直接切换按钮
- **多语言模式**：显示下拉菜单

语言切换器会根据当前页面自动生成对应语言的 URL。

### 日期格式本地化

日期格式根据语言自动调整：

- **中文/日文**：`2024年1月15日`
- **英文**：`January 15, 2024`
- **德文**：`15. Januar 2024`

日期格式配置在 `_data/{lang}/strings.yml` 中：

```yaml
date_formats:
  short: "__YEAR__年__MONTH____DAY__日"
  long: "__YEAR__年__MONTH____DAY__日"
```

### 翻译字符串管理

界面文本翻译存储在 `_data/{lang}/strings.yml` 文件中：

```yaml
# _data/zh_CN/strings.yml
archive:
  prefix: 归档
  category_suffix: 属于该分类
  tag_suffix: 包含该标签
  year_suffix: 属于该年份

months:
  long:
    january: 一月
    february: 二月
    # ...
  short:
    january: 1月
    february: 2月
    # ...

footer:
  copyright: © {{ 'now' | date: '%Y' }} {{ site.first_name }} {{ site.last_name }}.
```

在模板中使用翻译字符串：

```liquid
{{ site.data[site.active_lang].strings.footer.copyright }}
{{ site.data[site.active_lang].strings.archive.prefix }}
```

## 技术栈

了解项目的技术栈有助于更好地自定义和扩展。

### 前端

- **Markdown**：使用 Markdown 编写页面、博客文章和集合内容
- **Liquid 模板**：[Liquid](https://shopify.github.io/liquid/) 用于动态模板生成
- **HTML & CSS**：使用语义化 HTML5 和现代 CSS
- **SCSS**：样式表使用 [SCSS (Sass)](https://sass-lang.com/) 编写
- **Bootstrap**：[Bootstrap 4.6](https://getbootstrap.com/docs/4.6/) 用于响应式网格和基础组件
- **JavaScript**：用于深色模式切换、搜索和动态内容渲染等交互功能
- **MathJax**：在页面和博客文章中渲染 LaTeX 数学公式
- **Mermaid**：在 Markdown 中直接创建图表（流程图、时序图等）
- **图标库**：Font Awesome、Academicons 和 Scholar Icons

### 后端

- **Jekyll 4.x**：静态网站生成器
- **Ruby Gems** (Jekyll 插件)：

  - `jekyll-polyglot`：多语言支持
  - `jekyll-scholar`：管理 BibTeX 参考文献文件
  - `jekyll-archives-v2`：按分类、标签或日期创建归档页
  - `jekyll-feed`：生成 Atom (RSS) 订阅源
  - `jekyll-jupyter-notebook`：集成 Jupyter 笔记本
  - `jekyll-minifier`：压缩 HTML、CSS 和 JavaScript
  - `jekyll-paginate-v2`：处理博客文章和归档分页
  - `jekyll-tabs`：添加标签页支持
  - `jekyll-toc`：自动生成目录
  - `jemoji`：转换 Emoji 短代码
  - 其他工具：`jekyll-link-attributes`、`jekyll-imagemagick`、`jekyll-twitter-plugin`、`jekyll-get-json` 等

- **Python**：用于实用脚本（如 Google Scholar 引用更新，位于 `bin/`）

### 构建与部署

- **GitHub Actions**：自动化构建、测试和部署工作流（`.github/workflows/`）
- **GitHub Pages**：静态网站托管
- **Prettier**：代码格式化工具

## 修改简历信息

简历可使用两种格式之一创建，选择最适合您的格式，或同时使用两者进行切换：

### RenderCV 格式（推荐）

[`_data/cv.yml`](_data/cv.yml) 使用 [RenderCV](https://rendercv.com/) YAML 格式，可读性强，专为生成专业简历设计。此格式还支持通过 GitHub Actions 可选地自动生成 PDF。

**选择此格式时：**

1. 编辑 [`_data/cv.yml`](_data/cv.yml) 中的简历数据
2. 可选地自定义 PDF 样式：
   - [`assets/rendercv/design.yaml`](assets/rendercv/design.yaml) — 设计和样式
   - [`assets/rendercv/locale.yaml`](assets/rendercv/locale.yaml) — 本地化和格式化
   - [`assets/rendercv/settings.yaml`](assets/rendercv/settings.yaml) — RenderCV 设置
3. 如仅显示此格式，删除 [`assets/json/resume.json`](assets/json/resume.json)（可选）

### JSONResume 格式

[`assets/json/resume.json`](assets/json/resume.json) 使用 [JSONResume](https://jsonresume.org/) 标准格式，兼容其他工具和服务。

**选择此格式时：**

1. 编辑 [`assets/json/resume.json`](assets/json/resume.json) 中的简历数据
2. 如仅显示此格式，删除 [`_data/cv.yml`](_data/cv.yml)（可选）

### 同时使用两种格式

可同时保留 [`_data/cv.yml`](_data/cv.yml) 和 [`assets/json/resume.json`](assets/json/resume.json)，通过设置 [`_pages/cv.md`](_pages/cv.md) 中的 `cv_format` frontmatter 变量进行切换：

```yaml
---
layout: cv
cv_format: rendercv # 选项: rendercv 或 jsonresume
---
```

将 `rendercv` 改为 `jsonresume` 可显示 JSONResume 格式。

### 自动生成 PDF（仅 RenderCV）

使用 RenderCV 格式时，GitHub Actions 工作流可自动生成 PDF 版本的简历。PDF 保存至 `assets/rendercv/rendercv_output/`。

**将自动生成的 PDF 链接到简历页面：**

在 [`_pages/cv.md`](_pages/cv.md) 的 frontmatter 中设置 `cv_pdf` 变量指向生成的 PDF：

```yaml
---
layout: cv
cv_pdf: /assets/rendercv/rendercv_output/CV.pdf
cv_format: rendercv
---
```

**禁用自动 PDF 生成：**

删除或注释 [`.github/workflows/render-cv.yml`](.github/workflows/render-cv.yml) 工作流文件。

## 修改用户和仓库信息

用户和仓库信息定义在 [`_data/repositories.yml`](_data/repositories.yml)。可添加任意数量的用户和仓库。

### 配置外部服务 URL

仓库页面使用外部服务显示 GitHub 统计信息和成就徽章。默认服务：

- `github-readme-stats.vercel.app`：用户统计和仓库卡片
- `github-profile-trophy.vercel.app`：GitHub 档案成就

这些默认服务由第三方托管，可能不 100% 可用。为提高可靠性、隐私保护和自定义能力，可自托管这些服务。

在 [`_config.yml`](_config.yml) 中配置 URL：

```yaml
external_services:
  github_readme_stats_url: https://github-readme-stats.vercel.app
  github_profile_trophy_url: https://github-profile-trophy.vercel.app
```

自托管请参考各自仓库的部署说明：

- [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- [github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy)

## 创建新页面

在 [`_pages/{lang}/`](_pages/) 目录添加新的 Markdown 文件创建新页面。最简单的方法是复制现有页面并修改。可通过修改 Markdown 文件的 [frontmatter](https://jekyllrb.com/docs/front-matter/) 中的 [layout](https://jekyllrb.com/docs/layouts/) 属性选择布局，通过 [permalink](https://jekyllrb.com/docs/permalinks/) 属性修改访问路径。

**多语言页面：** 为每种语言创建对应的页面文件，例如：

- 中文：`_pages/zh_CN/mypage.md`
- 英文：`_pages/en_US/mypage.md`

## 创建博客文章

在 [`_posts`](_posts/) 目录添加新的 Markdown 文件创建博客文章。文件名必须遵循格式 `YYYY-MM-DD-title.md`。最简单的方法是复制现有博客文章并修改。注意某些博客文章在 frontmatter 中有可选字段，用于启用特定行为或功能。

如要创建未准备好发布但希望用 git 追踪的博客文章，可创建 [`_drafts`](https://jekyllrb.com/docs/posts/#drafts) 目录并保存在其中。

## 外部博客文章同步

可从 Medium、Google Blog 等外部平台同步博客文章到您的网站。在 [`_config.yml`](_config.yml) 中配置：

```yaml
external_sources:
  - name: medium.com
    rss_url: https://medium.com/@username/feed
    categories: [external-posts]
    tags: [medium]
  - name: Google Blog
    posts:
      - url: https://blog.google/technology/ai/example/
        published_date: 2024-05-14
    categories: [external-posts]
    tags: [google]
```

**配置说明：**

- `name`：外部平台名称
- `rss_url`：RSS 订阅源 URL（支持 RSS 的平台）
- `posts`：手动指定文章列表（不支持 RSS 的平台）
- `categories`：为外部文章分配的分类
- `tags`：为外部文章分配的标签

**RSS 同步**：自动获取 RSS 源中的所有文章
**手动同步**：在 `posts` 中手动添加文章 URL 和发布日期

## 创建新项目

在 [`_projects/{lang}/`](_projects/) 目录添加新的 Markdown 文件创建新项目。

**多语言项目：** 为每种语言创建对应的项目文件。

## 添加动态消息

在 [`_news/{lang}/`](_news/) 目录添加新的 Markdown 文件向关于页面添加动态消息。有两种类型：内联消息和带链接的消息。带链接的消息跳转到新页面，内联消息直接显示在关于页面中。

## 创建研究页面

研究页面用于展示研究兴趣和问题。在 [`_pages/{lang}/`](_pages/) 目录创建研究页面：

```yaml
---
layout: page
title: 研究
permalink: /research/
nav: false
description: 我的研究兴趣与正在进行的项目
research_questions:
  - title: "研究问题 1"
    image: "/assets/img/research/question1.png"
  - title: "研究问题 2"
    image: "/assets/img/research/question2.png"
  - title: "研究问题 3"
    image: "/assets/img/research/question3.png"
---
```

在关于页面启用研究概要：

```yaml
---
layout: about
research_summary:
  enabled: true
---
```

## 创建工具箱页面

工具箱页面用于展示个人开发的工具和应用。在 [`_pages/{lang}/`](_pages/) 目录创建工具箱页面：

```yaml
---
layout: page
title: 工具
permalink: /toolbox/
nav: true
nav_order: 6
---
```

在 [`_data/{lang}/toolbox.yml`](_data/) 中添加工具数据：

```yaml
- type: Web 应用
  title: 应用名称
  desc: 应用描述
  icon: /assets/img/icon.png
  screenshot: /assets/img/screenshot.png
  open_url: /app/index.html
  github_url: https://github.com/user/repo
```

**支持的工具类型：**

- Web 应用
- Python 脚本
- 命令行工具
- 桌面应用
- 浏览器扩展

## 创建下拉菜单

下拉菜单用于组织多个相关页面。在 [`_pages/{lang}/`](_pages/) 目录创建下拉菜单页面：

```yaml
---
layout: page
title: 更多
nav: false
nav_order: 7
dropdown: true
children:
  - title: 简历
    permalink: /cv/
  - title: 书架
    permalink: /books/
  - title: 人脉
    permalink: /people/
---
```

- `dropdown: true`：将页面标记为下拉菜单
- `children`：列出下拉菜单中的子页面

## 添加集合

Jekyll 主题使用 [集合](https://jekyllrb.com/docs/collections/) 将工作按类别组织。主题默认包含四个集合：`news`、`projects`、`books` 和 `teachings`。

### 创建新集合

1. **在 `_config.yml` 中添加集合**

   在 [`_config.yml`](_config.yml) 的 `collections` 部分添加新集合：

   ```yaml
   collections:
     news:
       defaults:
         layout: post
       output: true
     projects:
       output: true
     courses:
       output: true
       permalink: /courses/:path/
   ```

2. **为集合项创建文件夹**

   在根目录创建以下划线开头的新文件夹，名称与集合匹配。

3. **创建集合着陆页**

   在 `_pages/` 中添加 Markdown 文件作为集合的主页。

4. **添加导航链接**

   更新 [`_pages/dropdown.md`](_pages/dropdown.md) 或页面导航配置。

5. **创建集合项**

   在新集合文件夹中添加带有适当 frontmatter 和内容的 Markdown 文件。

### 在集合中使用 Frontmatter 字段

可在集合项中定义自定义 frontmatter 字段并在着陆页中使用。

### 创建教学集合

主题包含预配置的 `_teachings/` 集合用于课程页面。

#### 课程文件格式

在 `_teachings/` 中创建 Markdown 文件：

```yaml
---
layout: course
title: 课程标题
description: 课程描述
instructor: 您的姓名
year: 2023
term: 秋季
location: 教室101
time: 周一三五 10:00-11:00
course_id: course-id # 应唯一
schedule:
  - week: 1
    date: 1月10日
    topic: 简介
    description: 课程内容和目标概述
    materials:
      - name: 幻灯片
        url: /assets/pdf/example_pdf.pdf
---
其他课程内容、信息或资源...
```

#### 课程集合注意事项

1. 每个课程文件必须有唯一的 `course_id`
2. 课程文件在教学页面上按 `year` 分组
3. 每年内按 `term` 排序
4. frontmatter 下方的内容（Markdown 格式）将显示在个别课程页面上
5. schedule 部分将自动格式化为表格

#### 必填字段

- `layout: course` — 必须设置为 course 布局
- `title` — 课程标题
- `year` — 课程教学年份（用于排序）
- `course_id` — 课程唯一标识符

#### 可选字段

- `description` — 课程简要描述
- `instructor` — 讲师姓名
- `term` — 学期（如秋季、春季、夏季）
- `location` — 课程地点
- `time` — 上课时间
- `schedule` — 课程详情列表

### Jupyter Notebook 支持

主题支持将 Jupyter Notebook (.ipynb) 文件转换为博客文章或页面。

**前提条件：**

1. 安装 Python 和 nbconvert：

   ```bash
   pip install jupyter nbconvert
   ```

2. jekyll-jupyter-notebook 插件已在 Gemfile 中配置

**使用方法：**

1. 将 `.ipynb` 文件放在 `_posts/` 或 `_pages/` 目录
2. 确保 Jupyter 样式文件已部署到 `assets/jupyter/` 目录
3. 主题会自动将 Notebook 转换为 HTML 并渲染

**Frontmatter 配置：**

```yaml
---
layout: post
title: "Jupyter Notebook 标题"
date: 2024-01-01
---
```

**自定义 Jupyter 样式：**

编辑 `assets/jupyter/` 目录下的样式文件来自定义 Notebook 的外观。

### 带分类和标签的集合

如需添加分类和标签支持，需在 [`_config.yml`](_config.yml) 中配置 `jekyll-archives` 部分。

### 创建自定义元数据组和归档页

除了内置的 `categories` 和 `tags` 字段，可为集合创建自定义元数据字段。

#### 理解 Jekyll 对字段的处理

Jekyll 仅对两个字段有**特殊内置支持**：

- **`categories`** — 自动将空格分隔的值拆分为数组
- **`tags`** — 自动将空格分隔的值拆分为数组

自定义字段保持为**字符串**，需要在 Liquid 模板中显式处理。

#### 示例：添加自定义「改编」字段

1. **在集合 frontmatter 中添加字段**

   ```yaml
   ---
   layout: book-review
   title: 教父
   author: Mario Puzo
   categories: classics crime historical-fiction
   adaptations: movie TV-series video-game novel-adaptation
   ---
   ```

2. **在布局模板中处理自定义字段**

   ```liquid
   {% if page.adaptations %}
     {% assign page_adaptations = page.adaptations | split: ' ' %}
     {% for adaptation in page_adaptations %}
       <a href="{{ adaptation | slugify | prepend: '/books/adaptation/' | relative_url }}">
         {{ adaptation }}
       </a>
     {% endfor %}
   {% endif %}
   ```

3. **为自定义字段启用归档页**

   在 [`_config.yml`](_config.yml) 的 `jekyll-archives` 配置中添加自定义字段。

4. **测试归档页**

   配置后重新构建网站，归档页将自动生成。

#### 字段命名最佳实践

- 使用**小写**单词，多词用**连字符**分隔：`live-action`、`video-game`、`TV-series`
- 选择**有意义的名称**描述分组：`genres`、`adaptations`、`media-types`、`settings` 等
- 保持字段值**简短一致**
- 在 README 或注释中记录自定义字段

## 添加新出版物

在 [`_bibliography/papers.bib`](_bibliography/papers.bib) 文件中创建新条目。可在 Google Scholar 中找到 BibTeX 条目。

默认情况下，出版物按年份排序，最新的显示在前。可在 [`_config.yml`](_config.yml) 的 `Jekyll Scholar` 部分更改此行为。

支持的字段：`abstract`、`altmetric`、`annotation`、`arxiv`、`bibtex_show`、`blog`、`code`、`dimensions`、`doi`、`eprint`、`hal`、`html`、`isbn`、`pdf`、`pmid`、`poster`、`slides`、`supp`、`video`、`website` 等。

### 作者标注

出版物中自己的作者条目通过 [`_config.yml`](_config.yml) 中的 `scholar:last_name` 和 `scholar:first_name` 字符串数组标识。

在 [`_data/coauthors.yml`](_data/coauthors.yml) 中维护合著者信息，Jekyll 将自动插入到其网页的链接。

#### 多语言作者姓名

为支持多语言出版物（如中文和英文），可在 [`_config.yml`](_config.yml) 中配置多个姓名变体：

```yaml
scholar:
  last_name: [Xu, 徐]
  first_name: [Wenjie, Wayne, 文杰]
```

#### 中文出版物

中文语言出版物使用以下格式：

1. **作者字段**：使用 `姓 名` 格式（空格分隔，无逗号）
2. **语言 ID**：使用 `zh-CN`（或 `zh_CN`）
3. **姓名顺序**：模板根据 `langid` 字段自动显示中文姓名为"姓 名"顺序，英文姓名为"First Last"顺序
4. **通讯作者**：在名字后添加 `*`（如 `文杰*`），将渲染为上标

**示例中文出版物条目：**

```bibtex
@article{example2024,
  title    = {面向复合极端事件应对的应急物资保障体系优化路径},
  author   = {徐 文杰* and 李 龙飞 and 索 伟岚 and 孙 晓蕾},
  journal  = {中国减灾},
  year     = {2024},
  langid   = {zh-CN},
}
```

### 按钮（通过自定义 BibTeX 关键词）

可使用自定义 BibTeX 关键词影响条目在网页上的显示方式：

- `abbr`：在条目左侧添加缩写
- `abstract`：添加"摘要"按钮
- `altmetric`：添加 [Altmetric](https://www.altmetric.com/) 徽章
- `annotation`：在作者列表末尾添加弹出信息
- `arxiv`：添加 Arxiv 网站链接
- `bibtex_show`：添加"BibTeX"按钮
- `blog`：添加"博客"按钮
- `code`：添加"代码"按钮
- `dimensions`：添加 [Dimensions](https://www.dimensions.ai/) 徽章
- `hal`：添加 HAL 网站链接
- `html`：插入"HTML"按钮
- `pdf`：添加"PDF"按钮
- `poster`：添加"海报"按钮
- `slides`：添加"幻灯片"按钮
- `supp`：添加"补充材料"按钮
- `website`：添加"网站"按钮

### 出版物预览图

可为每个出版物添加预览图（缩略图）：

1. **添加图片文件**：将预览图放在 `assets/img/publication_preview/` 目录
2. **在 BibTeX 中引用**：添加 `preview` 字段

### 出版物徽章

在 `_config.yml` 中设置以下选项启用出版物徽章：

```yaml
enable_publication_badges:
  altmetric: true
  dimensions: true
  google_scholar: true
  inspirehep: true
```

### 期刊/会议缩写

添加自定义颜色的期刊/会议缩写：

1. 创建 `_data/venues.yml`
2. 在 BibTeX 中添加 `abbr` 字段

### 注释和高亮

添加注释以说明作者角色或突出成就：

```bibtex
@article{example2024,
  title       = {A Great Discovery},
  author      = {Smith, John* and Doe, Jane and Brown, Bob},
  annotation  = {<b>最佳论文奖</b>},
}
```

### 出版物分组和筛选

#### 按年份

出版物自动按年份分组并按降序排序（最新的在前）。可在 `_config.yml` 中更改。

#### 按类型

使用 `bibtex_show` 字段控制可见性，或使用 `abbr` 字段添加自定义类别。

#### 精选出版物

标记精选/突出的出版物，添加 `selected` 字段。

### 完整 BibTeX 字段参考

**必填字段：**

- `title`：出版物标题
- `author`：作者列表
- `year`：出版年份
- 以下之一：`journal`、`booktitle` 或 `publisher`

**推荐字段：**

- `doi`：数字对象标识符（启用自动徽章获取）
- `volume`、`number`、`pages`：书目详细信息
- `month`：出版月份

**显示增强字段：**

- `preview`：预览图片文件名
- `abbr`：徽章的期刊/会议缩写
- `annotation`：HTML 注释文本
- `langid`：语言标识符（`zh-CN`、`en` 等）

**链接字段（创建按钮）：**

- `pdf`：PDF 文件路径或 URL
- `html`：HTML 版本链接
- `arxiv`：arXiv 标识符
- `doi`：DOI（自动生成链接）
- `hal`：HAL 标识符
- `eprint`：e-print 标识符
- `pmid`：PubMed ID
- `isbn`：ISBN（书籍）

**按钮字段：**

- `code`：代码仓库链接
- `website`：项目网站 URL
- `blog`：博客文章 URL
- `video`：视频演示 URL
- `poster`：海报 PDF 路径
- `slides`：幻灯片 PDF 路径
- `supp`：补充材料

**徽章字段：**

- `altmetric`：Altmetric ID 或 `true`
- `dimensions`：Dimensions ID 或 `true`
- `gscholar`：设置为 `true` 显示 Google Scholar 徽章

**切换字段：**

- `bibtex_show`：显示 BibTeX 导出按钮（`true`/`false`）
- `abstract`：显示摘要展开按钮（`true`/`false`）

### 完整示例

```bibtex
@article{Xu2024MultiHazard,
  title       = {多灾害耦合情境下城市关键基础设施失效风险建模研究},
  author      = {索 玮岚 and 徐 文杰* and 孙 晓蕾},
  journal     = {中国管理科学},
  year        = {2025},
  month       = {dec},
  doi         = {10.16381/j.cnki.issn1003-207x.2025.0995},
  html        = {https://doi.org/10.16381/j.cnki.issn1003-207x.2025.0995},
  pdf         = {Xu2024MultiHazard.pdf},
  preview     = {Xu2024MultiHazard.png},
  langid      = {zh-CN},
  abbr        = {CSSCI},
  annotation  = {<b>CSSCI</b>},
  bibtex_show = {true},
  altmetric   = {true},
  dimensions  = {true},
  gscholar    = {true},
}

@inproceedings{Smith2024NeuralNetworks,
  title       = {Neural Networks for Complex Systems},
  author      = {Smith, John and Doe, Jane},
  booktitle   = {Proceedings of the International Conference on Machine Learning},
  year        = {2024},
  pages       = {123--135},
  publisher   = {PMLR},
  doi         = {10.48550/arXiv.2401.12345},
  html        = {https://proceedings.mlr.press/v235/},
  pdf         = {Smith2024NeuralNetworks.pdf},
  code        = {https://github.com/example/neural-networks},
  website     = {https://example.com/neural-networks},
  preview     = {Smith2024NeuralNetworks.png},
  abbr        = {ICML},
  selected    = {true},
  annotation  = {<b>口头报告</b>},
  bibtex_show = {true},
  altmetric   = {true},
  dimensions  = {true},
}
```

### 文件组织

出版物资源推荐目录结构：

```
assets/
├── img/
│   └── publication_preview/    # 预览图（PNG/JPG）
└── pdf/
    └── publications/           # PDF 文件
```

### 故障排除

**问题**：作者姓名未高亮显示

- 检查 `_config.yml` 中的 `scholar:last_name` 和 `scholar:first_name`
- 中文姓名使用 `姓 名` 格式，无逗号
- 确保 `langid` 设置正确（中文为 `zh-CN`）

**问题**：徽章未显示

- 验证 DOI 正确且可访问
- 检查 `_config.yml` 中 `enable_publication_badges` 设置为 `true`
- 确保有网络连接（徽章动态获取）

**问题**：预览图未显示

- 验证图片文件存在于 `assets/img/publication_preview/`
- 检查 `preview` 字段中的文件名完全匹配（区分大小写）
- 确保安装 ImageMagick 以进行自动图片调整大小

## 更改主题颜色

可通过编辑 [`_sass/_themes.scss`](_sass/_themes.scss) 文件中的 `--global-theme-color` 变量快速更改主题颜色。其他颜色变量也在该文件中列出。

## 功能开关

主题提供多种可选功能，可通过 [`_config.yml`](_config.yml) 中的开关项启用或禁用：

```yaml
enable_google_analytics: true # 启用 Google Analytics
enable_cronitor_analytics: false # 启用 Cronitor RUM 分析
enable_pirsch_analytics: false # 启用 Pirsch 分析
enable_openpanel_analytics: false # 启用 Openpanel 分析
enable_google_verification: false # 启用 Google 站点验证
enable_bing_verification: false # 启用 Bing 站点验证
enable_cookie_consent: false # 启用 GDPR 合规 Cookie 同意对话框
enable_masonry: true # 启用 Masonry 布局
enable_math: true # 启用数学公式渲染（使用 MathJax）
enable_tooltips: true # 启用章节标题自动工具提示
enable_darkmode: true # 启用深色/浅色模式切换
enable_navbar_social: false # 在导航栏显示社交链接
enable_project_categories: true # 启用项目分类
enable_medium_zoom: true # 启用图片缩放功能（类似 Medium）
enable_progressbar: true # 启用滚动进度条
enable_video_embedding: true # 启用视频嵌入功能
```

### 深色模式

通过 `enable_darkmode: true` 启用深色模式。用户可点击导航栏的月亮/太阳图标切换主题。深色模式会自动适配所有支持的主题颜色。

### 滚动进度条

通过 `enable_progressbar: true` 启用滚动进度条。进度条显示在页面顶部，指示当前滚动位置。

### 工具提示

通过 `enable_tooltips: true` 启用章节标题的工具提示。鼠标悬停在章节标题上会显示一个指向该章节的链接图标，点击可复制链接。

### 图片缩放

通过 `enable_medium_zoom: true` 启用 Medium 风格的图片缩放。点击页面中的图片会以全屏方式显示，支持滚轮缩放。

### Masonry 布局

通过 `enable_masonry: true` 启用 Masonry 瀑布流布局。项目卡片会自动排列，填满可用空间。

## 自定义布局和界面

可在 [`_config.yml`](_config.yml) 中自定义布局和用户界面：

```yaml
back_to_top: true
footer_fixed: true
max_width: 930px
navbar_fixed: true
```

- `back_to_top`：在页脚显示"返回顶部"按钮
- `footer_fixed`：页脚固定在视口底部
- `max_width`：控制主内容区域最大宽度（像素）
- `navbar_fixed`：导航栏固定在页面顶部

## 添加社交媒体信息

通过 [`jekyll-socials` 插件](https://github.com/george-gca/jekyll-socials) 管理社交媒体信息。编辑 [`_data/socials.yml`](_data/socials.yml) 添加社交资料。

## 添加订阅

在 [`_config.yml`](_config.yml) 文件的 `newsletter` 部分添加订阅表单信息。

## 配置搜索功能

在 [`_config.yml`](_config.yml) 中自定义搜索功能：

```yaml
bib_search: true
posts_in_search: true
search_enabled: true
socials_in_search: true
```

- `bib_search`：启用出版物/参考文献搜索
- `posts_in_search`：在搜索索引中包含博客文章
- `search_enabled`：启用全站搜索功能
- `socials_in_search`：在搜索结果中包含社交媒体链接

## 社交媒体预览

主题支持 Open Graph (OG) 元标签，在社交媒体平台分享页面时创建丰富的预览。

### 启用方法

1. 打开 `_config.yml` 并设置：

   ```yaml
   serve_og_meta: true
   ```

2. 重新构建网站

### 配置预览图

可配置每个页面或全站范围的预览图。

**全站默认图片：**

在 `_config.yml` 中添加：

```yaml
og_image: /assets/img/your-default-preview-image.png
```

**每个页面的自定义图片：**

在页面的 frontmatter 中添加 `og_image`。

### 预览图最佳实践

- **尺寸**：1200×630 像素
- **格式**：PNG 或 JPG
- **大小**：保持在 5MB 以下
- **内容**：确保图片清晰代表页面内容

## 相关文章

主题可在每篇博客文章底部自动显示相关文章。

### 工作原理

默认显示与当前文章共享至少一个标签的最新文章。

### 配置

在 `_config.yml` 中编辑 `related_blog_posts` 部分：

```yaml
related_blog_posts:
  enabled: true
  max_related: 5
```

- `enabled`：设置为 `true` 显示相关文章，`false` 禁用
- `max_related`：最多显示的相关文章数（默认：5）

### 禁用特定文章的相关推荐

在文章的 frontmatter 中添加：

```yaml
---
layout: post
title: My Blog Post
related_posts: false
---
```

## 管理出版物显示

主题提供几个选项来自定义出版物显示方式：

```yaml
enable_publication_thumbnails: true
max_author_limit: 3
more_authors_animation_delay: 10
```

- `enable_publication_thumbnails`：显示出版物预览图
- `max_author_limit`：每篇出版物初始显示的最大作者数
- `more_authors_animation_delay`：显示额外作者的动画速度（毫秒）

## 评论系统

主题支持多种评论系统，可在 [`_config.yml`](_config.yml) 中配置。

### Giscus 评论（推荐）

Giscus 是基于 GitHub Discussions 的评论系统，支持 Markdown、LaTeX 和语法高亮。

**配置方法：**

1. 访问 [giscus.app](https://giscus.app/) 并按照说明为您的仓库设置 Giscus
2. 将配置信息添加到 [`_config.yml`](_config.yml)：

```yaml
giscus:
  repo: username/repo-name # GitHub 仓库
  repo_id: R_kgDOXXXXXXXXX # 仓库 ID
  category: Announcements # 讨论类别名称
  category_id: DIC_kwDOXXXXXXXXX # 类别 ID
  mapping: title # 识别讨论的方式
  strict: 1 # 严格模式
  reactions_enabled: 1 # 启用表情反应
  input_position: bottom # 输入框位置
  dark_theme: dark # 深色主题
  light_theme: light # 浅色主题
  emit_metadata: 0
  lang: zh_CN # 语言
```

**在页面启用评论**：

在页面的 frontmatter 中添加：

```yaml
---
comments: true
---
```

### Disqus 评论

Disqus 是广泛使用的第三方评论系统。

**配置方法：**

1. 在 [Disqus](https://disqus.com/) 注册账号并创建站点
2. 将 shortname 添加到 [`_config.yml`](_config.yml)：

```yaml
disqus_shortname: your-disqus-shortname
```

**在页面启用评论**：

在页面的 frontmatter 中添加：

```yaml
---
comments: true
---
```

## 添加 Google 日历

通过使用 `calendar.liquid` 包含在任何页面嵌入 Google 日历。

### 基本用法

在页面的 Markdown 文件中添加：

```liquid
{% include calendar.liquid calendar_id='your-calendar-id@group.calendar.google.com' timezone='Your/Timezone' %}
```

### 为页面启用日历脚本

在页面的 frontmatter 中添加 `calendar: true`。

### 可选：自定义日历样式

可使用 `style` 参数自定义 iframe 样式。

## 使用第三方库

主题支持多种第三方库，可在页面中通过 frontmatter 启用。

### 图表库

#### Chart.js

在页面的 frontmatter 中添加：

```yaml
---
chart:
  chartjs: true
---
```

然后在页面中使用 Chart.js 语法创建图表：

```html
<canvas id="myChart"></canvas>
<script>
  const ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["一月", "二月", "三月"],
      datasets: [
        {
          label: "数据集",
          data: [12, 19, 3],
        },
      ],
    },
  });
</script>
```

#### ECharts

在页面的 frontmatter 中添加：

```yaml
---
chart:
  echarts: true
---
```

#### Plotly

在页面的 frontmatter 中添加：

```yaml
---
chart:
  plotly: true
---
```

#### Vega/Vega-Lite

在页面的 frontmatter 中添加：

```yaml
---
chart:
  vega_lite: true
---
```

### 地图功能

#### Leaflet 地图

在页面的 frontmatter 中添加：

```yaml
---
map:
  id: "map"
  tile_layer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  zoom: 13
  center: [51.505, -0.09]
  markers:
    - location: [51.505, -0.09]
      label: "标记 1"
    - location: [51.51, -0.1]
      label: "标记 2"
---
```

### 灯箱库

#### Photoswipe

在页面的 frontmatter 中添加：

```yaml
---
images:
  photoswipe: true
---
```

然后使用以下 HTML 结构：

```html
<a href="large-image.jpg" data-pswp-width="1600" data-pswp-height="900">
  <img src="thumbnail.jpg" alt="描述" />
</a>
```

#### Lightbox2

在页面的 frontmatter 中添加：

```yaml
---
images:
  lightbox2: true
---
```

然后使用：

```html
<a href="large-image.jpg" data-lightbox="gallery">
  <img src="thumbnail.jpg" alt="描述" />
</a>
```

#### Venobox

在页面的 frontmatter 中添加：

```yaml
---
images:
  venobox: true
---
```

然后使用：

```html
<a href="large-image.jpg" class="venobox" data-gall="myGallery">
  <img src="thumbnail.jpg" alt="描述" />
</a>
```

#### Spotlight

在页面的 frontmatter 中添加：

```yaml
---
images:
  spotlight: true
---
```

然后使用：

```html
<a href="large-image.jpg" class="spotlight">
  <img src="thumbnail.jpg" alt="描述" />
</a>
```

### 图片功能

#### 图片轮播

在页面的 frontmatter 中添加：

```yaml
---
images:
  slider: true
---
```

然后使用：

```html
<swiper-container>
  <swiper-slide><img src="slide1.jpg" alt="幻灯片 1" /></swiper-slide>
  <swiper-slide><img src="slide2.jpg" alt="幻灯片 2" /></swiper-slide>
</swiper-container>
```

#### 图片对比

在页面的 frontmatter 中添加：

```yaml
---
images:
  compare: true
---
```

然后使用：

```html
<img-comparison-slider>
  <figure slot="first" class="before">
    <img src="before.jpg" alt="修改前" />
    <figcaption>修改前</figcaption>
  </figure>
  <figure slot="second" class="after">
    <img src="after.jpg" alt="修改后" />
    <figcaption>修改后</figcaption>
  </figure>
</img-comparison-slider>
```

### 其他功能

#### 伪代码

在页面的 frontmatter 中添加：

```yaml
---
pseudocode: true
---
```

然后使用：

```text
{% pseudocode %}
algorithm quicksort(A):
    if length(A) <= 1:
        return A
    pivot := A[length(A) // 2]
    left := [x for x in A if x < pivot]
    middle := [x for x in A if x == pivot]
    right := [x for x in A if x > pivot]
    return quicksort(left) + middle + quicksort(right)
{% endpseudocode %}
```

#### Mermaid 图表

在页面的 frontmatter 中添加：

```yaml
---
mermaid:
  enabled: true
---
```

然后使用 Mermaid 语法：

````text
```mermaid
graph TD
    A[开始] --> B{判断}
    B -->|是| C[执行]
    B -->|否| D[跳过]
    C --> E[结束]
    D --> E
````

````

#### 代码对比

在页面的 frontmatter 中添加：

```yaml
---
code_diff:
  type: "unified"  # 或 "split"
---
````

然后在页面中：

```html
<div id="code-diff"></div>
<script>
  const diff = Diff2Html.create("before\nafter\n", { inputFormat: "diff" });
  document.getElementById("code-diff").innerHTML = diff;
</script>
```

## 更新第三方库

在 [`_config.yml`](_config.yml) 的 `third_party_libraries` 部分管理各种第三方 JavaScript 和 CSS 库。

## 删除内容

可通过在 `_config.yml` 的 `exclude` 部分添加不需要的文件来删除内容，以避免更新代码时的合并冲突。

### 删除博客页面

- 删除 [`_posts`](_posts/) 目录
- 删除博客页面 [`_pages/blog.md`](_pages/blog.md)
- 在 [`_pages/dropdown.md`](_pages/dropdown.md) 中删除博客页面引用
- 删除 [`_pages/about.md`](_pages/about.md) 中的 `latest_posts` 部分
- 删除 [`_config.yml`](_config.yml) 文件中的 `Blog` 部分及相关部分

### 删除动态消息区域

- 删除 [`_news`](_news/) 目录
- 删除 [`_includes/news.liquid`](_includes/news.liquid) 文件和 [`_pages/about.md`](_pages/about.md) 中的引用
- 删除 [`_pages/about.md`](_pages/about.md) 中的 `announcements` 部分
- 删除 [`_config.yml`](_config.yml) 文件中 `Collections` 部分的 news 部分

### 删除项目页面

- 删除 [`_projects`](_projects/) 目录
- 删除项目页面 [`_pages/projects.md`](_pages/projects.md)
- 在 [`_pages/dropdown.md`](_pages/dropdown.md) 中删除项目页面引用
- 删除 [`_config.yml`](_config.yml) 文件中 `Collections` 部分的项目部分

### 删除出版物页面

- 删除 [`_bibliography`](_bibliography/) 目录
- 删除出版物页面 [`_pages/publications.md`](_pages/publications.md)
- 在 [`_pages/dropdown.md`](_pages/dropdown.md) 中删除出版物页面引用
- 删除 [`_config.yml`](_config.yml) 文件中的 `Jekyll Scholar` 部分

### 删除仓库页面

- 删除仓库页面 [`_pages/repositories.md`](_pages/repositories.md)
- 删除 [`_includes/repository/`](_includes/repository/) 目录

### 通过注释 Frontmatter 块禁用页面

对于 [`_pages`](_pages/) 目录中的 `.md` 文件，可通过注释 frontmatter 块临时禁用。

## 为 Lighthouse Badger 添加 Token

创建 [个人访问令牌 (PAT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) 并将其作为名为 `LIGHTHOUSE_BADGER_TOKEN` 的 [密钥](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-encrypted-secrets-for-a-repository) 添加到仓库。

### Lighthouse Badger 的个人访问令牌（精细粒度）权限

- **contents**：访问权限：读取和写入
- **metadata**：访问权限：只读

## 图片功能

主题提供多种图片优化和增强功能。

### 响应式图片

通过 ImageMagick 自动生成多种尺寸的响应式图片。在 [`_config.yml`](_config.yml) 中配置：

```yaml
imagemagick:
  enabled: true # 启用响应式图片
  widths:
    - 480
    - 800
    - 1400
  input_directories:
    - assets/img/
  input_formats:
    - ".jpg"
    - ".jpeg"
    - ".png"
    - ".tiff"
    - ".gif"
  output_formats:
    webp: "-auto-orient -quality 85"
```

**前提条件**：确保系统已安装 ImageMagick。在终端运行 `convert -version` 验证。

**使用方法**：

```html
{% include figure.liquid path="assets/img/example.jpg" caption="示例图片" %}
```

主题会自动生成 480px、800px 和 1400px 宽度的 WebP 格式图片，并根据设备自动选择合适的尺寸。

### 懒加载图片

启用懒加载可加快页面加载速度。在 [`_config.yml`](_config.yml) 中设置：

```yaml
lazy_loading_images: true
```

启用后，所有图片会自动添加 `loading="lazy"` 属性，延迟加载视口外的图片。

**自定义特定图片的加载行为**：

```html
<img src="image.jpg" loading="eager" />
<!-- 立即加载 -->
<img src="image.jpg" loading="lazy" />
<!-- 懒加载 -->
```

### 图片缩放

通过 `enable_medium_zoom: true` 启用 Medium 风格的图片缩放。点击图片会以全屏方式显示，支持滚轮缩放。

### 图片灯箱

主题支持多种灯箱库，参见[使用第三方库](#使用第三方库)章节。

## 自定义字体、间距等

`_sass/` 目录包含按功能和用途组织的专门 SCSS 文件。根据修改内容编辑相关文件：

- **排版**：`_typography.scss` - 字体、标题样式、链接、表格、引用
- **导航**：`_navbar.scss` - 导航栏和下拉菜单
- **颜色和主题**：`_themes.scss` - 主题颜色，`_variables.scss` - 全局变量
- **博客样式**：`_blog.scss` - 博客文章列表、标签、分页
- **出版物**：`_publications.scss` - 参考文献和出版物显示样式
- **组件**：`_components.scss` - 可复用组件（卡片、简介、项目）
- **代码和工具**：`_utilities.scss` - 代码高亮、表单、模态框、动画
- **布局**：`_layout.scss` - 整体页面布局样式

### 字体配置（推荐）

字体系统推荐直接在 SCSS 层配置（不使用额外 YAML 字体配置文件）：

- 在 `_sass/_fonts.scss` 维护字体栈、角色映射、字重/字号和响应式缩放变量
- 在 `_sass/_typography.scss`、`_sass/_base.scss` 等模块应用字体角色（正文、标题、代码、引用、按钮）
- 在 `_includes/head.liquid` 维护字体预连接、预加载和 Google Fonts 样式链接

> 建议：字体配置只保留一处事实来源（SCSS），避免模板和样式分散维护。

## 定时发布

主题包含一个工作流，可在每天结束时（23:30）自动发布所有预定在特定日期的帖子。默认情况下禁用此操作，要启用需转到 `.github/workflows/` 并找到名为 `schedule-posts.txt` 的工作流文件。将其重命名为 `schedule-posts.yml`。

### 文件名格式

在根目录下名为 `_scheduled/` 的文件夹中保存文件，格式与 `_posts/` 中的相同。

> 示例文件名：`2024-08-26-This file will be uploaded on 26 August.md`

### 重要说明

- 调度器每天在 🕛 23:30 UTC 上传帖子
- 仅在其预定日期的 23:30 UTC 上传帖子
- 仅上传遵循 `yyyy-mm-dd-title.md` 模式的文件
- 调度器通过将帖子从 `_scheduled/` 目录移动到 `_posts/` 来工作
- 文件名中的日期是文件上传的日期

## 分析工具

主题支持多种分析工具，可用于追踪网站访问情况和用户行为。所有分析工具都可通过 [`_config.yml`](_config.yml) 配置。

### Google Analytics (GA4)

Google Analytics 是广泛使用的网站分析工具。

**配置方法：**

1. 访问 [Google Analytics](https://analytics.google.com/) 并创建 GA4 属性
2. 获取测量 ID（格式：G-XXXXXXXXXX）
3. 在 [`_config.yml`](_config.yml) 中配置：

```yaml
google_analytics: G-H0H008S793 # 您的 GA4 测量 ID
enable_google_analytics: true # 启用 Google Analytics
```

**启用 Cookie 同意**：

如果启用了 `enable_cookie_consent: true`，Google Analytics 将使用 Google Consent Mode 在获得用户同意前以隐私模式运行。

### Cronitor RUM

Cronitor Real User Monitoring (RUM) 提供性能监控和用户体验分析。

**配置方法：**

1. 在 [Cronitor](https://cronitor.io/) 注册账号
2. 获取 RUM 站点 ID
3. 在 [`_config.yml`](_config.yml) 中配置：

```yaml
cronitor_analytics: XXXXXXXXX # Cronitor RUM 站点 ID
enable_cronitor_analytics: true # 启用 Cronitor Analytics
```

### Pirsch Analytics

Pirsch 是 GDPR 合规的隐私优先分析工具。

**配置方法：**

1. 在 [Pirsch](https://pirsch.io/) 注册账号
2. 获取站点 ID（32 个字符）
3. 在 [`_config.yml`](_config.yml) 中配置：

```yaml
pirsch_analytics: XXXXXXXXXXXXXXXXXXXXXXXX # Pirsch 站点 ID
enable_pirsch_analytics: true # 启用 Pirsch Analytics
```

### Openpanel Analytics

Openpanel 是隐私优先的分析平台。

**配置方法：**

1. 在 [Openpanel](https://openpanel.dev/) 注册账号
2. 获取客户端 ID
3. 在 [`_config.yml`](_config.yml) 中配置：

```yaml
openpanel_analytics: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX # Openpanel 客户端 ID
enable_openpanel_analytics: true # 启用 Openpanel Analytics
```

### 站点验证

#### Google Search Console

在 [`_config.yml`](_config.yml) 中配置：

```yaml
google_site_verification: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX # Google 站点验证 ID
enable_google_verification: true # 启用 Google 验证
```

#### Bing Webmaster Tools

在 [`_config.yml`](_config.yml) 中配置：

```yaml
bing_site_verification: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX # Bing 站点验证 ID
enable_bing_verification: true # 启用 Bing 验证
```

## GDPR Cookie 同意对话框

主题包含内置的 GDPR 合规 Cookie 同意对话框，帮助尊重访客隐私并遵守隐私法规。

### 工作原理

- 访客首次访问网站时显示同意对话框
- 访客可**全部接受**、**全部拒绝**或**自定义偏好**分析 Cookie
- 分析脚本默认被阻止，仅在明确同意后运行
- Google Consent Mode 确保在授予同意前 Google 服务以隐私模式运行
- 用户偏好保存在浏览器中，后续访问时尊重
- 对话框支持移动响应式和多语言

### 使用场景

- ✅ 如果网站服务于欧盟访客并使用任何分析，则**必需**
- ✅ 建议任何使用分析、跟踪或营销工具的网站使用
- ❌ 如果网站不使用任何分析提供商，则不需要

### 启用方法

1. 打开 `_config.yml` 并定位到以下行：

   ```yaml
   enable_cookie_consent: false
   ```

2. 将其更改为：

   ```yaml
   enable_cookie_consent: true
   ```

3. 重新构建网站

### 自定义同意对话框

同意对话框配置和消息定义在 [`_scripts/cookie-consent-setup.js`](_scripts/cookie-consent-setup.js)。可自定义对话框标题、按钮标签、Cookie 类别和描述等。

### 支持的分析提供商

启用 Cookie 同意后，这些分析提供商会被自动阻止，直到用户同意：

- **Google Analytics (GA4)** – 使用 Google Consent Mode
- **Cronitor RUM** – 真实用户监控
- **Pirsch Analytics** – GDPR 合规分析替代方案
- **Openpanel Analytics** – 隐私优先分析平台

### 与分析工具集成

当 `enable_cookie_consent: true` 时，模板自动：

1. 为所有分析脚本标签添加 `type="text/plain" data-category="analytics"`
2. 加载同意库并初始化 Google Consent Mode
3. 在用户更改对话框中的偏好时更新同意偏好

### 开发者指南

如需编程检查同意状态或对同意更改做出反应，库公开以下 API：

```javascript
// 检查用户是否授予分析同意
window.CookieConsent.getCategories().analytics; // 返回 true 或 false

// 监听同意更改
window.CookieConsent.onChange(function (consentData) {
  // 处理同意更改
});
```

## 为 Google Scholar 引用更新设置个人访问令牌

本项目包含一个自动化工作流，使用 Google Scholar 更新出版物的引用计数。工作流直接将更改提交到 `main` 分支的 `_data/citations.yml`。

### 为什么需要 PAT

GitHub 限制默认 `GITHUB_TOKEN` 在工作流内提交时触发其他工作流。使用 PAT 可克服此限制并实现完全自动化。

### 如何设置 PAT

1. **创建个人访问令牌**

   - 前往 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - 点击"Generate new token"（经典或精细粒度）
   - 授予至少以下权限：
     - `repo`（经典令牌，私有仓库）、`public_repo`（经典令牌，公共仓库）或 `contents: read/write`（精细粒度令牌）

2. **将 PAT 添加为仓库密钥**

   - 在 GitHub 上前往仓库
   - 导航至 `Settings` > `Secrets and variables` > `Actions` > `New repository secret`
   - 将密钥命名为 `PAT`（必须与工作流中使用的名称匹配）
   - 粘贴 PAT 并保存

3. **工作流使用**

   工作流 `.github/workflows/update-citations.yml` 使用此 PAT 将更新提交到 `_data/citations.yml`。
