---
locale: zh-CN
title: typush
description: 用于 Typst Universe 包生态自动化开发、校验与发布的 Go 语言 CLI 工具，支持 Homebrew 一键安装。
github: https://github.com/Vncntvx/typush
importance: 3
category: typst
giscusComments: true
routeSlug: typush
---

<div align="center">

# typush

</div>

typush 用于开发与发布 [Typst](https://typst.app/) 包，覆盖本地开发、校验、安装，以及提交到 [Typst Universe](https://github.com/typst/packages)。

项目名称由 Typst 与 push 组合而成，意为将包推送到 [universe](https://typst.app/universe/)。

## 安装

使用 Homebrew（macOS / Linux）：

```sh
brew install Vncntvx/tap/typush
```

使用 Go 安装：

```sh
go install github.com/Vncntvx/typush@latest
```

也可以直接从 [Releases](https://github.com/Vncntvx/typush/releases) 下载对应平台的预编译二进制文件。

## 前置要求

`publish universe` 与 `dev --check` 命令依赖 [GitHub CLI](https://cli.github.com)。安装 `gh` 并执行 `gh auth login` 完成登录即可；使用 `typush login universe` 可以检查当前的认证状态。

## 快速上手

创建新包：

```sh
typush init
```

开发模板或本地调试时，将当前目录链接到 `@preview` 命名空间：

```sh
typush dev
```

发布到 Universe：

```sh
typush publish universe
```

更详细的各命令用法与参数说明请参阅 [使用指南](https://github.com/Vncntvx/typush/blob/main/docs/guide.md)。

## 命令

```sh
typush --help
typush init [name]                                             # 交互式初始化 typst.toml、README.md、LICENSE 与入口文件
typush bump [patch|minor|major|<ver>] [-i files] [-t tag] [-n] # 递增版本号（支持 -i 多文件同步与 -n 模拟运行）
typush check [--local] [--no-compile]                          # 校验包规范与编译状态
typush list [namespace] [-a] [-t] [--json]                     # 列出已安装包（-a 包含缓存，-t 树状层级）
typush install <ns> [-n]                                       # 安装到指定命名空间（支持 -n 模拟运行）
typush uninstall <target> [-y] [-n]                            # 卸载指定版本、整个包或命名空间
typush clone <package> [dest] [-f] [-n]                        # 从 Universe 下载官方包源码并解压到本地
typush download <repo> [-c ref] [-n ns] [--subdir dir] [...]  # 从 Git 仓库下载并安装包（支持指定子目录）
typush dev [--check]                                           # 链接到 @preview（优先通过官方 CDN 检查命名冲突）
typush dev list                                                # 列出 @preview 中已有的开发软链接及路径
typush clean [package] [-n]                                    # 清理 @preview 中的开发软链接（支持 -n 模拟运行）
typush search <query> [--limit 20] [--json]                    # 搜索 Universe 包
typush info <package>[:version] [--json]                       # 查看 Universe 包元数据与版本历史
typush outdated [path] [--json]                                # 检查 .typ 文件中的过时依赖
typush update [package...] [-n] [--file path]                  # 更新 .typ 中的依赖版本（支持 -n 模拟运行）
typush metadata [field] [--json]                               # 查看包元数据（可提取单字段或输出 JSON）
typush path [namespace]                                        # 显示本地 Typst 包数据目录路径
typush completion <bash|zsh|fish|powershell>                   # 生成 shell 自动补全脚本
typush exclude <globs...> [-n]                                 # 将指定文件添加到发布排除列表（支持 -n 模拟运行）
typush login universe                                          # 验证 GitHub CLI 认证状态
typush publish universe [-n]                                   # 校验并提交 PR 到 Universe（支持 -n 模拟运行）
typush pr status [number|url]                                  # 查看 PR 状态与审查意见（默认自动匹配当前包）
typush pr checks [number|url] [-w]                             # 查看或等待 Universe 官方 CI 结果
typush ci plan [--packages "a b"]                              # 扫描工作区并输出 CI matrix JSON
typush ci generate [...] [-n]                                  # 生成自动化发布工作流（支持 -n 预览）
```

`publish` 提交前先在本地跑一遍 Universe 校验，覆盖未知字段、作者格式、分类、SPDX 许可证、必要文件、模板缩略图与排除规则。

## 本地校验

当系统路径中存在 `typst`（或通过 `TYPST_BIN` 环境变量指定）时，`typush check` 会在本地运行官方 CI 的检查项：

- 编译：普通包检查导入是否成功；模板包在隔离临时目录中先执行 `typst init @preview/<name>:<version>` 再编译入口文件。检查全程不读写本机的 Typst 数据。可用 `--no-compile` 跳过编译，或用 `--local` 仅检查元数据格式。
- README：检查图片缺失的 alt 文本、失效的相对链接、GFM 语法支持，以及是否使用了指向默认分支的可变链接。
- 文件：禁止携带字体文件，检查是否遗漏排除了样例/测试文件或大文件，并提示未引用的手册文件。
- 导入：检查入口文件是否存在相对导入、包自引用版本是否与当前版本一致，以及模板中的导入路径是否合规。

## 开发

```sh
go build ./...
go test ./...
go vet ./...
gofmt -l .
```

## 许可证

[MIT](https://github.com/Vncntvx/typush/blob/main/LICENSE)
