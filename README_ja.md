<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<div align="center">

# 🌐 BrowserScope - ブラウザ機能検知＆マルチツールボックス

[![GitHub Stars](https://img.shields.io/github/stars/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=indigo)](https://github.com/Xlone9773/Browser-Scope)
[![GitHub Forks](https://img.shields.io/github/forks/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=blue)](https://github.com/Xlone9773/Browser-Scope)
[![Repository Size](https://img.shields.io/github/repo-size/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=emerald)](https://github.com/Xlone9773/Browser-Scope)
[![License](https://img.shields.io/github/license/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=slate)](https://github.com/Xlone9773/Browser-Scope/blob/main/LICENSE)
[![React Version](https://img.shields.io/badge/react-v19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-v5.8-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind_css-v4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/express-v5.2-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)

[简体中文](README_zh.md) | [繁體中文(台灣)](README_zhtw.md) | [繁體中文(香港)](README_zhhk.md) | **日本語** | [Русский](README_ru.md) | [English Version](README.md)

</div>

---

細部までこだわり抜いた、洗練されたブラウザ機能検知プラットフォームおよび堅牢なテスト用ツールボックスです。深い動作環境分析、ハードウェア特性評価、ネットワーク診断プロバイダを提供します。

## ✨ 主な特徴

- 🔍 **包括的な深度検知** - システム、ハードウェア、ネットワーク、ストレージ、セキュリティポリシー、ストリーミングメディアを含む13以上の主要な側面を網羅。
- 🧰 **万能ツールボックス** - ネットワーク速度テスト、高精度IPアドレス検索、UDP Pingテストなどの高度な診断機能を搭載。
- 🎨 **洗練されたUIディテール** - 好みのアセントカラーから選択できるダーク/ライトテーマ、グローバルアニメーションコントロール、余白と美学を重視したカードベースデザイン。
- 🌍 **マルチ言語サポート** - 日本語、英語、簡体字/繁体字中国語、ロシア語を含む6言語に完全対応。
- 🗄️ **フルスタックプロキシエンジン** - Expressバックエンドサーバーを搭載し、CORSの回避、APIのプロキシ、UDP検出などの高度なサーバーサイド処理を統合。
- 📜 **ソフトウェアとアセットの帰属表記** - プロジェクトで使用されているオープンソースライセンス、責務、システムフォントの帰属情報を明記するコンプライアンスパネルを独立実装。

---

## 🚀 デプロイと動作環境

> [!WARNING]
> **フルスタックアーキテクチャ：** 本プロジェクトはNode.js + Expressのフルスタック環境が必須です。CORSの回避、APIプロキシなどの重要なビジネスロジックはサーバーサイドで処理されるため、**静的ホスティング（SPA静的ページのみ）での動作はできません。**

> [!CAUTION]
> **制限されたネットワーク環境について (UDPプロキシ)：** Vercel、AWS Lambda、エッジランタイムなどの一部のServerlessプラットフォームでは、下層のUDPソケットや持続的なネットワーク接続がブロックされる場合があります。
> アプリケーションには**環境検知・段階的フォールバック機能**が組み込まれており、UDPプロキシが未サポートのプラットフォームでは、関連するトグルやコンポーネントが自動的にグレーアウトされ、「未対応」の表記となります。フルネットワーク検知機能を利用する場合は、VPSまたはDocker、Cloud Runなどのフルコンテナ環境へのデプロイを推奨します。

## 📦 機能モジュール概要

### 環境検知

| モジュール | 機能説明 |
|------|----------|
| 🖥️ **システム** | OSの詳細情報、ブラウザの正確なバージョン、User-Agentの解析。 |
| 💻 **ハードウェア** | CPUロジックコア数、メモリ制限値、GPUモデル/レンダラー情報の取得。 |
| 🌐 **ネットワーク＆連通性**| 有効な接続属性、帯域幅ベンチマーク、外部IPの高精度測位。 |
| 🔒 **セキュリティ / CSP** | HTTPS状態、サンドボックス保護(CSP)状態、詳細なパーミッションAPI一覧。 |
| 📺 **ディスプレイ＆解像度**| 画面解像度、ディスプレイの色深度、高PPI（ピクセル比）検知。 |
| 🆔 **指紋プロファイリング** | デバイスからハッシュを計算し、ユニークなデバイスフィンガープリント（ブラウザ指紋）を生成。 |
| 💾 **ストレージ上限値** | IndexedDB、LocalStorageおよび各APIのストレージクォータと空き容量。 |
| 📍 **位置情報＆タイムゾーン**| GPS測位情報の取得、現在のタイムゾーン、時差、ロケール設定。 |
| 📹 **メディアデバイス** | 使用可能なカメラ、マイク、スピーカー等のデバイス名と権限状態の一覧。 |
| 🎬 **メディアコーデック** | 各種近代的な動画/音声エンコーダ・デコーダ形式（HDR等を含む）への互換性確認。 |

### 実用的なツール
- **高度なネットワーク診断** - 同源ポリシーを回避する高速テスト、UDP DNS問い合わせによるネットワーク状態検証。
- **データエクスポート** - 検知された数百以上のシステムステータスを、整形されたJSONファイルとして一クリックで保存。
- **ローカルAI推論 (Transformers.js)** - WebAssemblyを用いてブラウザ内で直接ニューラルモデルを実行し、CPU/GPUハードウェアのベンチマーク計測を実施。
- **高忠実度PDFレポート作成** - `html2canvas`と`jsPDF`を用いてアクティブなDOMをレンダリングし、オフライン共有が可能なPDF診断書を構築・出力。
- **ソフトウェア＆アセット帰属表記** - 使用オープンソースライブラリ（React, FingerprintJS, Motionなど）と組み込みデザインフォントのライセンスと帰属の明示。
- **フローティングウィジェット** - モバイル・デスクトップどちらでも快適に動作する、画面上の最小化可能なPWAステータスモニター。

---

## 🛠️ 技術スタック

| カテゴリ | フレームワーク / 技術 |
|------|-------------|
| **フロントエンド**| React 19 + TypeScript 5.8 (厳格モード) |
| **バックエンド** | Express + Node.js (APIプロキシ＆連通性検証) |
| **スタイル＆アイコン**| Tailwind CSS V4 + Lucide React |
| **ビルド＆コンパイル**| Vite 6.2 + ESBuild |
| **セキュリティ・セキュリティ** | FingerprintJS + Workbox PWA Suite |

---

## 📝 スタートガイド

### ローカル開発環境の起動

```bash
# 1. リポジトリをクローン
git clone https://github.com/Xlone9773/Browser-Scope
cd Browser-Scope

# 2. フロントエンドとExpressの全依存関係をインストール
npm install

# 3. 開発用サーバーを起動
npm run dev
```
起動完了後、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスするとリアルタイムプレビューが表示されます。

### 成果物のビルドと実行

```bash
# 本番環境用にコードをビルド
npm run build

# ビルドしたプロダクション用フルスタックサーバーを起動
npm run start
```

---

## 📂 ディレクトリ構成

```text
/
├── appearance/          # テーマ、ビジュアルスタイル設定
├── components/          # Reactコンポーネント
│   ├── cards/           # 個別の能力検知カード (システム、CPU、ネットワーク等)
│   ├── compute/         # 演算ストレステストツール
│   ├── hardware/        # WebGL・GPU等ハードウェア診断
│   ├── heatmap/         # センサー＆ネットワーク可視化ヒートマップ
│   ├── layout/          # 共通レイアウト (ヘッダー、フッター)
│   ├── sections/        # セクショングループ分類コンポーネント
│   ├── settings/        # 開発者ツール、コンフィグメニュー
│   ├── speedtest/       # 帯域幅ベンチマーク診断スイート
│   └── ui/              # 原子レベルの無状態UIコンポーネント
├── hooks/               # 共有React Hooks
├── services/            # システムコア・バックグラウンドロジック分配
│   ├── detectors/       # 各機能検知用スクリプト群
│   ├── app.worker.ts    # 計算ストレス用Web Worker
│   ├── detectionService.ts # 統合検知エントリポイント
│   └── score.ts         # ハードウェアスコア演算ロジック
├── utils/               # 汎用ヘルパー関数
│   ├── i18n/            # 18nローカライズ辞書
│   └── logger/          # コンソールインターセプト・ログ表示サービス
├── src/main.tsx         # Reactフロントエンドマウントエントリ
└── server.ts            # フルスタックExpressプロキシサーバー
```

---

## 🙌 オープンソース帰属表記

BrowserScopeの設計に貢献した、以下の素晴らしいプロジェクトとチームに感謝します：

- **[React](https://react.dev/)** - 宣言的UIコンポーネントフレームワーク
- **[Tailwind CSS](https://tailwindcss.com/)** - ユーティリティファーストのCSSフレームワーク
- **[Express](https://expressjs.com/)** - Node.js用軽量Webアプリケーションサーバー
- **[Lucide Icons](https://lucide.dev/)** - ベクターグラフィックUIアイコンライブラリ
- **[FingerprintJS](https://fingerprint.com/)** - セキュアで一意なブラウザ指紋生成ライブラリ
- **[Transformers.js](https://github.com/xenova/transformers.js)** - オンブラウザ動作する軽量ディープラーニング推論エンジン
- **[html2canvas](https://github.com/niklasvh/html2canvas)** ＆ **[jsPDF](https://github.com/parallax/jsPDF)** - 診断書レポート作成・PDFダウンロード機能
- **[Eruda](https://github.com/liriliri/eruda)** ＆ **[vConsole](https://github.com/Tencent/vConsole)** - モバイルブラウザ向けポータブルデバッグコンソール
- **[Vite](https://vitejs.dev/)** ＆ **[ESBuild](https://esbuild.github.io/)** - 超高速ビルドツール＆HMRシステム

---

## 📝 ライセンス
本プロジェクトは **MIT ライセンス** の下で公開されています。詳細については [LICENSE](LICENSE) をご覧ください。

<div align="center">

**🌟 もしBrowserScopeがお役に立ちましたら、Starをいただけると励みになります！**

[AI Studioでの最新デプロイ結果を確認する](https://ai.studio/apps/6b6b64a8-d32c-490e-a9ab-35a241066ab2)

</div>
