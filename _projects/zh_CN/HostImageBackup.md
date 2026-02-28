---
layout: page
title: HostImageBackup
description: 一个模块化的 Python 命令行工具，轻松将各类图床服务的图片备份到本地。
img: assets/img/project/HostImageBackup/HostImageBackup.png
importance: 1
category: work
giscus_comments: true
---

一个模块化的 Python 命令行工具，轻松将各类图床服务的图片备份到本地。

## 🚀 功能特色

- **🏗️ 模块化架构** - 易于扩展新服务商
- **🌐 多服务商支持** - 阿里云 OSS、腾讯云 COS、SM.MS、Imgur、GitHub
- **📊 可视化进度** - 备份过程有美观的进度条
- **🎨 丰富 CLI 界面** - 直观的命令行体验
- **⚙️ 灵活配置** - 基于 YAML 的配置管理
- **🔄 断点续传** - 可无缝继续中断的传输
- **📝 全面日志** - 详细操作日志
- **🧪 测试完善** - 完善的测试覆盖保证可靠性

## 🎯 为什么选择这个工具？

在当今数字时代，图片分散存储在多个云服务和平台。本工具解决了以下问题：

- **备份与迁移**：将云服务图片备份到本地
- **多服务聚合**：整合多平台图片
- **定时备份**：支持定时任务或 CI/CD 自动备份
- **归档管理**：创建有序的本地图片归档
- **灾备保障**：维护离线副本以保证业务连续性

## 📋 支持的服务商

| 服务商     | 功能                          | 备注                    |
| ---------- | ----------------------------- | ----------------------- |
| **OSS**    | ✅ 列表、备份、断点续传、跳过 | 需阿里云凭证            |
| **COS**    | ✅ 列表、备份、断点续传、跳过 | 需腾讯云凭证            |
| **SM.MS**  | ✅ 列表、备份                 | 公共 API，有限速限制    |
| **Imgur**  | ✅ 列表、备份                 | 需 Imgur 客户端 ID/密钥 |
| **GitHub** | ✅ 列表、备份                 | 需 GitHub Token 及权限  |

## 🛠️ 安装方法

### 前置条件

- Python 3.10 及以上
- 备份操作需网络连接

### 方法一：使用 pip（推荐）

```sh
# 从 PyPI 安装
pip install host-image-backup

# 验证安装
host-image-backup --help
# 或使用简写
hib --help
```

### 方法二：开发环境安装

```sh
# 克隆仓库
git clone https://github.com/Vncntvx/HostImageBackup.git
cd HostImageBackup

# 推荐使用 uv 安装
uv lock
uv sync --all-extras

# 或使用 pip
pip install -e ".[dev]"
```

## 🚀 快速开始

### 基本用法

```sh
# 1. 初始化配置
host-image-backup init

# 2. 编辑配置文件
# Linux/macOS: ~/.config/host-image-backup/config.yaml
# Windows: %APPDATA%/host-image-backup/config.yaml

# 3. 测试服务商连接
host-image-backup test oss

# 4. 备份指定服务商图片
host-image-backup backup oss --output ./my-backup

# 5. 备份所有已启用服务商
host-image-backup backup-all --output ./full-backup
```

### 配置示例

```yaml
# Global settings
default_output_dir: "./backup"
max_concurrent_downloads: 5
timeout: 30
retry_count: 3
log_level: "INFO"

# Provider configurations
providers:
  oss:
    enabled: true
    access_key_id: "your_access_key"
    access_key_secret: "your_secret_key"
    bucket: "your_bucket_name"
    endpoint: "oss-cn-hangzhou.aliyuncs.com"
    prefix: "images/"

  github:
    enabled: true
    token: "ghp_your_personal_access_token"
    owner: "your_username"
    repo: "your_repository"
    path: "images"
```

## 📁 项目结构

```text
HostImageBackup/
├── src/host_image_backup/     # Main package
│   ├── providers/             # Provider implementations
│   ├── config.py             # Configuration management
│   ├── cli.py                # Command-line interface
│   └── services.py           # Core backup services
├── tests/                    # Test suite
├── pyproject.toml           # Project metadata and dependencies
└── README.md               # Documentation
```

## 🔧 工作原理

1. **加载配置** - 从 YAML 配置读取服务商设置
2. **服务商发现** - 自动检测已启用服务商
3. **图片列表** - 获取各服务商可用图片
4. **并发下载** - 进度可视化地下载图片
5. **错误处理** - 自动重试失败下载并记录日志
6. **断点续传** - 跳过已存在文件，支持中断续传

## 📖 高级用法

### CLI 命令参考

| 命令         | 说明                 | 别名             |
| ------------ | -------------------- | ---------------- |
| `init`       | 初始化默认配置文件   | -                |
| `backup`     | 备份指定服务商图片   | -                |
| `backup-all` | 备份所有已启用服务商 | -                |
| `list`       | 列出所有可用服务商   | `list-providers` |
| `test`       | 测试服务商连接       | -                |
| `info`       | 显示服务商详细信息   | -                |

### 应用场景

- **个人照片备份**：多平台照片一键备份
- **服务商迁移**：从一个平台导出再导入到另一个
- **定时自动备份**：结合定时任务自动执行
- **归档管理**：本地图片有序归档

## 🔍 详细功能说明

本工具具备企业级特性：

- ✅ **异步操作**，备份更快
- ✅ **智能重试**，网络故障自动处理
- ✅ **全面日志**，便于审计
- ✅ **模块化设计**，易于扩展
- ✅ **类型安全配置**，Pydantic 校验
- ✅ **丰富控制台输出**，进度可视化

## 🛡️ 安全与最佳实践

- **凭证安全**：切勿将凭证提交到版本库
- **环境变量支持**：可用环境变量配置
- **文件权限**：自动设置安全配置文件权限
- **网络安全**：仅支持 HTTPS 连接及超时处理

## 🙏 鸣谢

本项目采用现代 Python 工具及最佳实践：

- **Typer**：优雅的 CLI 接口
- **Rich**：增强控制台输出
- **Pydantic**：强健的配置校验
- **Loguru**：全面日志记录

## 🤝 贡献方式

欢迎贡献！项目采用现代 Python 开发规范：

- 全代码类型注解
- 完善测试覆盖，使用 pytest
- 代码格式化，使用 Ruff
- 预提交钩子保证代码质量
- GitHub Actions 持续集成

## 📄 许可证

本项目采用 MIT 许可证，详情见 [LICENSE](https://github.com/Vncntvx/HostImageBackup/blob/main/LICENSE)。

<footer lang="zh-cn" style="
  background-color: #f8f9fa;
  color: #6c757d;
  font-size: 0.85rem;
  line-height: 1.5;
  padding: 1rem 1.5rem;
  margin-top: 2rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
">
  <p style="margin: 0; word-break: break-word;">
    本页面由生成式 AI 自动翻译，可能存在不准确或信息不完整之处。
    <a href="mailto:wenjie.xu.cn@outlook.com" style="
      color: #007bff;
      text-decoration: none;
    ">欢迎反馈</a>帮助我们改进。
  </p>
</footer>
