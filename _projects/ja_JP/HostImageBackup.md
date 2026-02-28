---
layout: page
title: HostImageBackup
description: 複数の画像ホスティングサービスから画像を簡単にローカルへバックアップできるモジュール式Python CLIツール。
img: assets/img/project/HostImageBackup/HostImageBackup.png
importance: 1
category: work
giscus_comments: true
---

さまざまな画像ホスティングサービスから画像を簡単にローカルにバックアップできる、モジュール式の Python CLI ツールです。

## 🚀 特徴

- **🏗️ モジュラーアーキテクチャ** - 新しいプロバイダーの追加が簡単
- **🌐 マルチプロバイダー対応** - Aliyun OSS、Tencent COS、SM.MS、Imgur、GitHub
- **📊 視覚的な進捗表示** - バックアップ操作の美しい進捗バー
- **🎨 豊富な CLI インターフェース** - 直感的なコマンドライン体験
- **⚙️ 柔軟な設定** - YAML ベースの設定管理
- **🔄 レジューム対応** - 中断した転送をシームレスに再開
- **📝 詳細なログ** - 操作履歴を詳細に記録
- **🧪 十分なテスト** - 信頼性のための包括的なテスト

## 🎯 このツールのメリット

現代のデジタル社会では、画像が複数のクラウドサービスやプラットフォームに分散して保存されています。本ツールは以下の課題を解決します：

- **クラウド画像のバックアップ・移行**：クラウドからローカルへの画像保存
- **マルチプロバイダー統合**：複数サービスの画像を一括管理
- **定期バックアップ**：cron や CI/CD で自動化
- **アーカイブ管理**：整理されたローカル画像アーカイブ作成
- **災害対策**：オフラインコピーで事業継続性を確保

## 📋 対応プロバイダー

| プロバイダー | 機能                                          | 備考                                     |
| ------------ | --------------------------------------------- | ---------------------------------------- |
| **OSS**      | ✅ リスト、バックアップ、レジューム、スキップ | Aliyun の認証情報が必要                  |
| **COS**      | ✅ リスト、バックアップ、レジューム、スキップ | Tencent の認証情報が必要                 |
| **SM.MS**    | ✅ リスト、バックアップ                       | 公開 API、レート制限あり                 |
| **Imgur**    | ✅ リスト、バックアップ                       | Imgur クライアント ID/シークレットが必要 |
| **GitHub**   | ✅ リスト、バックアップ                       | GitHub トークンとアクセス権が必要        |

## 🛠️ インストール

### 必要条件

- Python 3.10 以上
- バックアップ操作にはネットワーク接続が必要

### 方法1：pip でインストール（推奨）

```sh
# PyPI からインストール
pip install host-image-backup

# インストール確認
host-image-backup --help
# または短縮コマンド
hib --help
```

### 方法2：開発環境インストール

```sh
# リポジトリをクローン
git clone https://github.com/Vncntvx/HostImageBackup.git
cd HostImageBackup

# uv でインストール（推奨）
uv lock
uv sync --all-extras

# または pip
pip install -e ".[dev]"
```

## 🚀 クイックスタート

### 基本的な使い方

```sh
# 1. 設定ファイルを初期化
host-image-backup init

# 2. 設定ファイルを編集
# Linux/macOS: ~/.config/host-image-backup/config.yaml
# Windows: %APPDATA%/host-image-backup/config.yaml

# 3. プロバイダー接続テスト
host-image-backup test oss

# 4. プロバイダーから画像をバックアップ
host-image-backup backup oss --output ./my-backup

# 5. 有効な全プロバイダーからバックアップ
host-image-backup backup-all --output ./full-backup
```

### 設定例

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

## 📁 プロジェクト構成

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

## 🔧 動作概要

1. **設定読み込み** - YAML 設定からプロバイダー情報を取得
2. **プロバイダー検出** - 有効なプロバイダーを自動検出
3. **画像リスト取得** - 各プロバイダーから画像一覧取得
4. **並列ダウンロード** - 進捗表示付きで画像をダウンロード
5. **エラー処理** - 失敗したダウンロードを再試行し、エラーを記録
6. **レジューム対応** - 既存ファイルをスキップし、中断転送を再開

## 📖 高度な使い方

### CLI コマンド一覧

| コマンド     | 説明                                   | エイリアス       |
| ------------ | -------------------------------------- | ---------------- |
| `init`       | デフォルト設定ファイルを初期化         | -                |
| `backup`     | 指定プロバイダーから画像をバックアップ | -                |
| `backup-all` | 有効な全プロバイダーからバックアップ   | -                |
| `list`       | 利用可能なプロバイダー一覧表示         | `list-providers` |
| `test`       | プロバイダー接続テスト                 | -                |
| `info`       | プロバイダー詳細情報表示               | -                |

### 利用例

- **個人写真バックアップ**：複数サービスの写真を一括保存
- **プロバイダー間移行**：一方からエクスポートし他方へインポート
- **定期バックアップ**：cron で自動化
- **アーカイブ管理**：ローカル画像コレクションの整理

## 🔍 詳細機能

本ツールはエンタープライズレベルの機能を提供します：

- ✅ **非同期処理**で高速バックアップ
- ✅ **インテリジェントな再試行**でネットワーク障害に対応
- ✅ **包括的なログ**で監査証跡
- ✅ **モジュラー設計**で拡張容易
- ✅ **型安全な設定**（Pydantic 検証）
- ✅ **豊富なコンソール出力**と進捗表示

## 🛡️ セキュリティとベストプラクティス

- **認証情報の安全管理**：認証情報をバージョン管理に含めない
- **環境変数対応**：環境変数で設定可能
- **ファイル権限**：設定ファイルの安全な権限自動設定
- **ネットワークセキュリティ**：HTTPS 接続とタイムアウト処理

## 🙏 謝辞

本プロジェクトは最新の Python ツールとベストプラクティスを活用しています：

- **Typer**：美しい CLI インターフェース
- **Rich**：強化されたコンソール出力
- **Pydantic**：堅牢な設定検証
- **Loguru**：包括的なログ

## 🤝 コントリビュート

貢献歓迎！本プロジェクトは最新の Python 開発手法を採用しています：

- コード全体に型アノテーション
- pytest による十分なテスト
- Ruff でコード整形
- pre-commit で品質管理
- GitHub Actions で CI/CD

## 📄 ライセンス

本プロジェクトは MIT ライセンスです。詳細は [LICENSE](https://github.com/Vncntvx/HostImageBackup/blob/main/LICENSE) を参照してください。

<footer lang="ja" style="
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
    このページは生成 AI により自動翻訳されており、不正確または不完全な情報が含まれる場合があります。
    <a href="mailto:wenjie.xu.cn@outlook.com" style="
      color: #007bff;
      text-decoration: none;
    ">ご意見・ご感想はこちら</a>までお寄せください。
  </p>
</footer>
