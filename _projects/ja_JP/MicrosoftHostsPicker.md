---
layout: page
title: MicrosoftHostsPicker
description: 一个现代化的异步 Python 工具，可自动查找并选择 Microsoft 服务的最快 IP 地址。
img: assets/img/project/MicrosoftHostsPicker/MicrosoftHostsPicker.png
importance: 1
category: fun
giscus_comments: true
---

Microsoft サービス向けの最速 IP アドレスを自動で検索・選択する、最新の非同期 Python ツールです。

## 🚀 特徴

- **非同期 ping テスト** - 高速な結果のための同時レイテンシテスト
- **スマート IP 選択** - 最適な IP が見つかった時点で早期終了
- **モジュール型設定** - サービス定義のカスタマイズが簡単
- **美しいコンソール出力** - 豊かな進捗表示と結果
- **最新の Python** - asyncio、型ヒント、dataclass を活用

## 🎯 このツールの目的

一部地域では、Microsoft サービスが DNS によって最適でない IP に解決され、パフォーマンスが低下することがあります。本ツールは以下の方法でこの問題を解決します：

- 数百の IP アドレスを同時にテスト
- 各サービスの最小レイテンシエンドポイントを特定
- 最適化された hosts ファイルエントリを生成
- Xbox Live、Office CDN、Microsoft Store など 10 以上のサービスに対応

## 📋 対応サービス

- **Microsoft アカウント** - account.microsoft.com
- **Xbox Live CDN** - ゲーム配信・マルチプレイ
- **Xbox クラウド同期** - セーブデータ同期
- **Office CDN** - Office アプリのダウンロード・更新
- **Microsoft Store** - ストア画像・ページ
- **Microsoft ゲームダウンロード** - ゲームインストール・更新
- **Windows Update** - システム更新・パッチ
- **Microsoft ログイン** - 認証サービス（静的 IP）

## 🛠️ インストール

### 必要条件

- Python 3.12+
- ping テスト用のネットワーク接続

### 方法 1: uv を使用（推奨）

```sh
pip install uv
git clone https://github.com/Vncntvx/MicrosoftHostsPicker.git
cd MicrosoftHostsPicker
uv sync
```

### 方法 2: pip を使用

```sh
git clone https://github.com/Vncntvx/MicrosoftHostsPicker.git
cd MicrosoftHostsPicker
pip install ping3==4.0.4
```

## 🚀 使い方

### 基本的な使い方

```sh
python MicrosoftHostsPicker.py
```

### 詳細設定

`config.py` を編集して動作をカスタマイズできます：

```python
DEFAULT_CONFIG = {
    'ping_attempts': 2,           # 各 IP への ping 試行回数
    'ping_timeout': 0.5,          # ping のタイムアウト（秒）
    'ping_max_workers': 100,      # 同時 ping 数
    'good_enough_threshold': 50.0, # レイテンシ < 50ms でテスト終了
}
```

## 📁 プロジェクト構成

```text
MicrosoftHostsPicker/
├── MicrosoftHostsPicker.py    # メインアプリ
├── config.py                  # サービス設定
├── pyproject.toml            # メタデータ・依存関係
├── uv.lock                   # ビルド再現用ロックファイル
├── data/                     # IP データベース
│   ├── Microsoft_Account.txt
│   ├── Xbox_Live_CDN_1.txt
│   └── ...
└── hosts                     # 生成された hosts ファイル
```

## 🔧 動作概要

1. **設定読込** - `config.py` からサービス定義を取得
2. **非同期テスト** - IP アドレスを同時に ping
3. **スマート最適化** - 大規模 IP セットで早期終了
4. **結果生成** - 最適化 hosts エントリ作成
5. **ユーザー案内** - 実装手順を明確に表示

## 📖 出力の見方

- ✅ **緑のチェック**: 最適 IP 発見
- ❌ **赤い X**: 利用可能な IP なし
- ⚠️ **警告**: テスト失敗
- 📊 **進捗バー**: 大規模 IP セットの進捗表示

## 🛡️ システム hosts ファイルの場所

- **Windows**: `C:\Windows\System32\drivers\etc\hosts`
- **macOS/Linux**: `/etc/hosts`

hosts ファイルを編集する際は管理者権限/ sudo が必要です。

## 🙏 謝辞

本プロジェクトは [ButaiKirin/MicrosoftHostsPicker](https://github.com/ButaiKirin/MicrosoftHostsPicker) を基にしています。元作者に感謝します。

## 🤝 コントリビュート

貢献歓迎！Issue、機能要望、プルリクエストをお待ちしています。

## 📄 ライセンス

LICENSE ファイル記載の条件に従います。

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
    ">フィードバック歓迎</a> です。改善にご協力ください。
  </p>
</footer>
