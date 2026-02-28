---
layout: page
title: MicrosoftHostsPicker
description: 一个现代化的异步 Python 工具，可自动查找并选择 Microsoft 服务的最快 IP 地址。
img: assets/img/project/MicrosoftHostsPicker/MicrosoftHostsPicker.png
importance: 1
category: fun
giscus_comments: true
---

一个现代化的异步 Python 工具，可自动查找并选择 Microsoft 服务的最快 IP 地址。

## 🚀 特性

- **异步ping测试** - 并发延迟测试，更快获得结果
- **智能IP选择** - 找到最优IP时智能提前终止
- **模块化配置** - 易于自定义的服务定义
- **美观的控制台输出** - 丰富多彩的进度指示器和结果展示
- **现代Python** - 使用 asyncio、类型提示和数据类构建

## 🎯 为什么需要这个工具？

在某些地区，Microsoft 服务可能因为 DNS 解析到次优 IP 地址而表现不佳。此工具通过以下方式解决这个问题：

- 并发测试数百个 IP 地址
- 识别每个服务的最低延迟端点
- 生成优化的 hosts 文件条目
- 支持包括 Xbox Live、Office CDN、Microsoft Store 等在内的 10+ 种 Microsoft 服务

## 📋 支持的服务

- **Microsoft Account** - account.microsoft.com
- **Xbox Live CDN** - 游戏内容分发和多人游戏服务
- **Xbox Cloud Sync** - 游戏存档同步
- **Office CDN** - Office 应用程序下载和更新
- **Microsoft Store** - 应用商店图片和页面
- **Microsoft Games Download** - 游戏安装和更新
- **Windows Update** - 系统更新和补丁
- **Microsoft Login** - 身份验证服务（静态IP）

## 🛠️ 安装

### 前置要求

- Python 3.12+
- 可进行 ping 测试的网络连接

### 方法一：使用 uv（推荐）

```sh
# 如果尚未安装 uv，先安装它
pip install uv

# 克隆仓库
git clone https://github.com/Vncntvx/MicrosoftHostsPicker.git
cd MicrosoftHostsPicker

# 安装依赖
uv sync
```

### 方法二：使用 pip

```sh
# 克隆仓库
git clone https://github.com/Vncntvx/MicrosoftHostsPicker.git
cd MicrosoftHostsPicker

# 安装依赖
pip install ping3==4.0.4
```

## 🚀 使用方法

### 基本用法

```sh
python MicrosoftHostsPicker.py
```

### 高级配置

您可以通过修改 `config.py` 来自定义行为：

```python
DEFAULT_CONFIG = {
    'ping_attempts': 2,           # 每个IP的ping次数
    'ping_timeout': 0.5,          # ping超时时间（秒）
    'ping_max_workers': 100,      # 并发ping限制
    'good_enough_threshold': 50.0, # 延迟小于50ms时停止测试
}
```

## 📁 项目结构

```text
MicrosoftHostsPicker/
├── MicrosoftHostsPicker.py    # 主应用程序
├── config.py                  # 服务配置
├── pyproject.toml            # 项目元数据和依赖
├── uv.lock                   # 可重现构建的锁定文件
├── data/                     # IP地址数据库
│   ├── Microsoft_Account.txt
│   ├── Xbox_Live_CDN_1.txt
│   └── ...
└── hosts                     # 生成的hosts文件（运行后）
```

## 🔧 工作原理

1. **配置加载** - 从 `config.py` 读取服务定义
2. **异步测试** - 并发ping数据文件中的IP地址
3. **智能优化** - 对大型IP集使用提前终止
4. **结果生成** - 创建优化的hosts文件条目
5. **用户指导** - 提供清晰的实施说明

## 📖 使用提示

- **选择性应用**：仅替换系统hosts文件中有问题的IP地址
- **先备份**：修改前始终备份现有的hosts文件
- **服务特定**：某些服务使用全球CDN，可能不需要手动配置
- **定期更新**：定期重新运行工具，因为最优IP可能会变化

## 🔍 理解输出

工具提供丰富的控制台输出：

- ✅ **绿色勾号**：找到最优IP
- ❌ **红色叉号**：未找到可用IP
- ⚠️ **警告**：测试失败
- 📊 **进度条**：显示大型IP集的测试进度

## 🛡️ 系统Hosts文件位置

- **Windows**: `C:\Windows\System32\drivers\etc\hosts`
- **macOS/Linux**: `/etc/hosts`

修改系统hosts文件时，请记住以管理员/sudo权限运行。

## 🙏 致谢

本项目基于 [ButaiKirin/MicrosoftHostsPicker](https://github.com/ButaiKirin/MicrosoftHostsPicker) 开发。感谢原作者的基础工作。

## 🤝 贡献

欢迎贡献！请随时提交问题、功能请求或拉取请求。

## 📄 许可证

此项目根据 LICENSE 文件中指定的条款进行许可。
