---
locale: zh-CN
title: modern-ucas-slides
description: 基于 Typst 与 Touying 构建的中国科学院大学现代学术幻灯片模板，支持三种主题风格与定理证明、三线表规范。
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

基于 **[Typst](https://typst.app/)** 与 **[Touying (0.8.0)](https://github.com/touying-typ/touying)** 构建的中国科学院大学（UCAS）现代学术幻灯片模板。

提供 `academic`、`minimal` 与 `bold` 三款视觉风格，支持 `16:9` 宽屏与 `4:3` 传统投影比例切换，内置结构化学术卡片、定理证明环境、规范三线表与参考文献管理功能。

---

## 功能特性

- **三种主题风格**：
  - `academic`（典雅校风 · 默认）：顶部包含 1.5pt 国科大蓝微装饰线与章节路径导航，右上角印记官方圆形校徽，底部呈现作者、标题、日期与页码，适用于开题汇报、中期检查与学位答辩。
  - `minimal`（极简风格）：纯白版面，顶部显示小号章节标签（Kicker），底部保留精简页码，适用于学术研讨与国际会议报告。
  - `bold`（科技风格）：顶部配置彩色阅读进度条，底部页码采用圆角徽章胶囊，配合章节转场页呈现深蓝全幅背景，适用于前沿讲座与专题技术分享。
- **页面比例支持**：原生支持 `aspect-ratio: "16-9"`（默认宽屏）与 `"4-3"`（传统投影），页面尺寸与边距自动自适应。
- **结构化卡片体系**：提供标准区块（`tblock`）、示例区块（`exampleblock`）、警示区块（`alertblock`）与注记条（`callout`），各卡片均具备防断页控制。
- **学术排版环境**：内置定理环境（`theorem`）、证明环境（`proof`）、无标号底端脚注（`blfootnote`）与规范学术三线表。
- **官方矢量校徽**：内置中国科学院大学官方标准横版矢量校徽（SVG）与圆形校徽（SVG），支持用户自定义传入或隐藏。
- **参考文献集成**：支持 BibTeX 格式文献库与 `@key` 正文引用。

---

## 快速上手

### 1. 安装 Typst

- **macOS (Homebrew)**:
  ```bash
  brew install typst
  ```
- **Windows (winget)**:
  ```bash
  winget install --id Typst.Typst
  ```
- **Linux / 其他平台**:
  参考 [Typst 官方安装指引](https://github.com/typst/typst/releases)。

### 2. 编译与预览

可以使用项目内置的 Makefile 命令：

```bash
# 编译生成 template/main.pdf
make compile

# 开启实时监听热重载 (保存文件时自动重新渲染)
make watch

# 编译并在系统默认阅读器中打开 PDF
make preview

# 规范化代码格式
make format
```

亦可直接使用 Typst CLI 原生命令（注意传 `--root .`）：

```bash
# 编译主文档
typst compile --root . template/main.typ

# 监听变化
typst watch --root . template/main.typ

# 命令行动态切换风格编译
typst compile --root . --input style=minimal template/main.typ
```

---

## 项目架构

```
modern-ucas-slides/
├── typst.toml                 # Typst 包元数据清单
├── lib.typ                    # 模板入口库文件 (统一对外导出全部主题与组件)
├── themes/                    # 主题样式引擎
│   ├── colors.typ             # 主题调色板
│   ├── header.typ             # 顶栏布局函数
│   ├── footer.typ             # 底栏布局函数
│   ├── preamble.typ           # 页面标题区域渲染
│   ├── slide.typ              # 幻灯片函数与备注面板
│   └── ucas.typ               # 主题初始化入口
├── components/                # 页面与排版组件
│   ├── logo.typ               # 校标矢量渲染函数
│   ├── cards.typ              # 卡片与基础区块 (tblock, exampleblock, alertblock)
│   ├── theorems.typ           # 定理与推导证明环境 (theorem, proof)
│   ├── callout.typ            # 提示注记条 (callout)
│   ├── helpers.typ            # 文本强调与底部脚注 (alert, blfootnote, red, green)
│   └── slides/                # 专用页面组件
│       ├── title.typ          # 扉页 (title-slide)
│       ├── outline.typ        # 目录页 (outline-slide)
│       ├── section.typ        # 章节过渡页 (new-section-slide)
│       └── ending.typ         # 结语页 (ending-slide)
├── assets/
│   └── vi/                    # 官方矢量校徽 (SVG)
├── template/                  # 模板示例目录
│   ├── main.typ               # 完整排版示例与使用说明
│   └── ref.bib                # BibTeX 参考文献库
├── Makefile                   # 编译、监听、预览与格式化构建脚本
├── build.sh                   # Shell 辅助构建脚本
├── .gitignore                 # Git 忽略规则
└── README.md                  # 项目说明文档
```

---

## 配置说明

在 `template/main.typ` 中，通过 `#show: ucas-theme.with(...)` 进行参数配置：

```typst
#import "../lib.typ": *

#show: ucas-theme.with(
  // 1. 风格切换: "academic" (默认) | "minimal" | "bold"
  style: "academic",

  // 2. 比例切换: "16-9" (默认宽屏) | "4-3" (传统投影)
  aspect-ratio: "16-9",

  // 3. 章节过渡页: 是否为一级大标题自动生成转场页 (默认 false)
  new-section-slide: false,

  // 4. 校徽配置: 默认使用内置矢量校徽，可传入自定义图像或设为 none
  logo: auto,

  // 5. 演示文稿元信息
  config-info(
    title: [基于 Typst 的中国科学院大学学术幻灯片],
    short-title: [modern-ucas-slides],
    subtitle: [模板使用说明与排版示例],
    author: [徐文杰],
    short-author: [Wenjie Xu],
    institution: [中国科学院大学 · 计算机科学与技术学院],
    date: datetime.today(),
  ),
)

// --------------------------------- 页面调用 --------------------------------- //
#title-slide()    // 扉页
#outline-slide()  // 目录页

= 第一章 章节标题
#slide(title: [页面标题])[
  页面正文内容
]

#ending-slide(title: [演示结束]) // 结束页
```

---

## 语法速查对照

| 排版功能         | 语法示例                                           | 说明                               |
| :--------------- | :------------------------------------------------- | :--------------------------------- |
| **单栏幻灯片**   | `#slide(title: [标题])[内容]`                      | 基础幻灯片页面                     |
| **多栏并列排版** | `#slide(composer: (1fr, 1.2fr))[左栏][右栏]`       | 使用 `composer` 指定各栏宽度比例   |
| **动态步进展示** | `#pause`                                           | 控制元素分步显现                   |
| **多级项目列表** | `- 一级项目`<br>`  - 二级项目`<br>`    - 三级项目` | 自动匹配国科大蓝方块、圆点与破折号 |
| **多级编号列表** | `+ 一级编号`<br>`  + 二级编号`                     | 自动数字递增标号                   |
| **标准区块**     | `#tblock(title: [标题])[...]`                      | 左侧强调条与浅灰底色               |
| **示例区块**     | `#exampleblock(title: [标题])[...]`                | 案例与数据展示                     |
| **警示区块**     | `#alertblock(title: [标题])[...]`                  | 边界条件与注意事项                 |
| **注记条**       | `#callout(title: [提示])[...]`                     | 总结观点与提示信息                 |
| **定理环境**     | `#theorem(title: [定理名])[...]`                   | 定理陈述环境                       |
| **证明环境**     | `#proof[...]`                                      | 推导证明环境，自动附带证毕符号     |
| **底部脚注**     | `#blfootnote[...]`                                 | 锚定幻灯片底端，不破坏正文布局     |
| **参考文献引用** | `@key`                                             | 关联 `ref.bib` 自动提取条目        |
| **参考文献列表** | `#bibliography("ref.bib", title: none)`            | 自动生成参考文献列表               |

---

## 许可证

本项目基于 [MIT License](https://github.com/Vncntvx/modern-ucas-slides/blob/main/LICENSE) 开源发布。
