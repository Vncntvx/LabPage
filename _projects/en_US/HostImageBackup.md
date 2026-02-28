---
layout: page
title: HostImageBackup
description: A modular Python CLI tool for backing up images from various image hosting services to your local machine with ease.
img: assets/img/project/HostImageBackup/HostImageBackup.png
importance: 1
category: work
giscus_comments: true
---

A modular Python CLI tool for backing up images from various image hosting services to your local machine with ease.

## 🚀 Features

- **🏗️ Modular Architecture** - Easy to extend with new providers
- **🌐 Multi-Provider Support** - Aliyun OSS, Tencent COS, SM.MS, Imgur, GitHub
- **📊 Visual Progress** - Beautiful progress bars for backup operations
- **🎨 Rich CLI Interface** - Intuitive command-line experience
- **⚙️ Flexible Configuration** - YAML-based configuration management
- **🔄 Resume Support** - Continue interrupted transfers seamlessly
- **📝 Comprehensive Logging** - Detailed operation logs
- **🧪 Well Tested** - Comprehensive test coverage for reliability

## 🎯 Why This Tool?

In today's digital world, we store images across multiple cloud services and platforms. This tool solves the challenge of:

- **Backing up and migrating** images from cloud providers to local storage
- **Multi-provider aggregation** - consolidating images from multiple services
- **Scheduled backups** via cron jobs or CI/CD pipelines
- **Archive management** - creating organized local image archives
- **Disaster recovery** - maintaining offline copies for business continuity

## 📋 Supported Providers

| Provider   | Features                      | Notes                           |
| ---------- | ----------------------------- | ------------------------------- |
| **OSS**    | ✅ List, backup, resume, skip | Requires Aliyun credentials     |
| **COS**    | ✅ List, backup, resume, skip | Requires Tencent credentials    |
| **SM.MS**  | ✅ List, backup               | Public API, rate limits apply   |
| **Imgur**  | ✅ List, backup               | Requires Imgur client ID/secret |
| **GitHub** | ✅ List, backup               | Requires GitHub token & access  |

## 🛠️ Installation

### Prerequisites

- Python 3.10+
- Network connectivity for backup operations

### Method 1: Using pip (Recommended)

```sh
# Install from PyPI
pip install host-image-backup

# Verify installation
host-image-backup --help
# Or use the short alias
hib --help
```

### Method 2: Development Install

```sh
# Clone the repository
git clone https://github.com/Vncntvx/HostImageBackup.git
cd HostImageBackup

# Install with uv (recommended)
uv lock
uv sync --all-extras

# Or use pip
pip install -e ".[dev]"
```

## 🚀 Quick Start

### Basic Usage

```sh
# 1. Initialize configuration
host-image-backup init

# 2. Edit the configuration file
# Linux/macOS: ~/.config/host-image-backup/config.yaml
# Windows: %APPDATA%/host-image-backup/config.yaml

# 3. Test provider connection
host-image-backup test oss

# 4. Backup images from a provider
host-image-backup backup oss --output ./my-backup

# 5. Backup from all enabled providers
host-image-backup backup-all --output ./full-backup
```

### Configuration Example

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

## 📁 Project Structure

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

## 🔧 How It Works

1. **Configuration Loading** - Reads provider settings from YAML config
2. **Provider Discovery** - Automatically detects enabled providers
3. **Image Listing** - Fetches available images from each provider
4. **Concurrent Download** - Downloads images with progress tracking
5. **Error Handling** - Retries failed downloads and logs errors
6. **Resume Support** - Skips existing files for interrupted transfers

## 📖 Advanced Usage

### CLI Command Reference

| Command      | Description                           | Aliases          |
| ------------ | ------------------------------------- | ---------------- |
| `init`       | Initialize default configuration file | -                |
| `backup`     | Backup images from specific provider  | -                |
| `backup-all` | Backup from all enabled providers     | -                |
| `list`       | List all available providers          | `list-providers` |
| `test`       | Test provider connection              | -                |
| `info`       | Show detailed provider information    | -                |

### Use Cases

- **Personal Photo Backup**: Backup all your photos from multiple services
- **Migration Between Providers**: Export from one service and import to another
- **Scheduled Backups**: Automate backups with cron jobs
- **Archive Management**: Create organized local image collections

## 🔍 Key Features in Detail

The tool provides enterprise-grade features:

- ✅ **Asynchronous operations** for faster backup speeds
- ✅ **Intelligent retry logic** for network failures
- ✅ **Comprehensive logging** for audit trails
- ✅ **Modular design** for easy extension
- ✅ **Type-safe configuration** with Pydantic validation
- ✅ **Rich console output** with progress indicators

## 🛡️ Security & Best Practices

- **Credential Security**: Never commit credentials to version control
- **Environment Variables**: Support for environment-based configuration
- **File Permissions**: Automatic secure configuration file permissions
- **Network Security**: HTTPS-only connections and timeout handling

## 🙏 Acknowledgments

This project leverages modern Python tools and best practices:

- **Typer**: For beautiful CLI interfaces
- **Rich**: For enhanced console output
- **Pydantic**: For robust configuration validation
- **Loguru**: For comprehensive logging

## 🤝 Contributing

Contributions are welcome! The project follows modern Python development practices:

- Type hints throughout the codebase
- Comprehensive test coverage with pytest
- Code formatting with Ruff
- Pre-commit hooks for code quality
- CI/CD with GitHub Actions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Vncntvx/HostImageBackup/blob/main/LICENSE) file for details.

<footer lang="en" style="
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
    This page was automatically translated by generative AI and may contain inaccuracies or incomplete information.
    <a href="mailto:wenjie.xu.cn@outlook.com" style="
      color: #007bff;
      text-decoration: none;
    ">Feedback is welcome</a> to help us improve.
  </p>
</footer>
