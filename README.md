# Smart Photo Info Extractor

写真から情報を自動抽出するスマートアプリケーション

## 機能

- **カスタムフィールド設定**: 抽出したい情報項目を自由に設定
- **画像アップロード**: ドラッグ&ドロップ対応の直感的なアップロード
- **AI画像解析**: Google Vision APIを使用したテキスト認識
- **データ編集**: 抽出された情報の手動編集・修正
- **エクスポート**: CSV、JSON形式でのデータ出力
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 環境変数の設定:
```bash
cp .env.local.example .env.local
```

3. Google Vision APIの設定:
   - [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
   - Vision APIを有効化
   - APIキーを作成
   - `.env.local`ファイルに設定

4. 開発サーバーの起動:
```bash
npm run dev
```

## 使用方法

1. **フィールド設定**: 抽出したい情報項目を設定（例：ワイン名、生産者、品種など）
2. **写真アップロード**: 対象の写真をアップロード
3. **自動解析**: Google Vision APIが画像からテキストを抽出
4. **データ確認・編集**: 抽出された情報を確認・修正
5. **エクスポート**: CSVまたはJSON形式でデータを出力

## 技術スタック

- **フロントエンド**: Next.js 13, React, TypeScript
- **UI**: Tailwind CSS, Shadcn/ui
- **画像解析**: Google Vision API
- **状態管理**: React Hooks + localStorage
- **デプロイ**: Vercel (推奨)

## 今後の拡張予定

- AWS S3との連携による画像ストレージ
- データベース連携（AWS RDS）
- 複数ユーザー対応
- AI精度向上のための機械学習モデル統合