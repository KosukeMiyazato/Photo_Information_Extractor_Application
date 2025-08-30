# デプロイメント手順

## 前提条件

1. Google Cloud Projectの作成
2. 必要なAPIの有効化:
   - Cloud Build API
   - Cloud Run API
   - Container Registry API
   - Vision API

## 環境変数の設定

Cloud Runサービスで以下の環境変数を設定してください：

```bash
NEXT_PUBLIC_GOOGLE_VISION_API_KEY=your_google_vision_api_key_here
```

## デプロイ手順

### 1. Google Cloud SDKの設定

```bash
# プロジェクトIDを設定
gcloud config set project YOUR_PROJECT_ID

# 認証
gcloud auth login
```

### 2. Cloud Buildでのデプロイ

```bash
# Cloud Buildトリガーを作成（初回のみ）
gcloud builds triggers create github \
  --repo-name=YOUR_REPO_NAME \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml

# 手動でビルド実行
gcloud builds submit --config cloudbuild.yaml .
```

### 3. 環境変数の設定

```bash
# Cloud Runサービスに環境変数を設定
gcloud run services update photo-info-extractor \
  --set-env-vars NEXT_PUBLIC_GOOGLE_VISION_API_KEY=your_api_key \
  --region asia-northeast1
```

## ローカル開発用Docker

```bash
# イメージをビルド
docker build -t photo-info-extractor .

# コンテナを実行
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GOOGLE_VISION_API_KEY=your_api_key \
  photo-info-extractor
```

## セキュリティ設定

### Cloud Run IAM設定

```bash
# 認証なしアクセスを許可（パブリックアプリの場合）
gcloud run services add-iam-policy-binding photo-info-extractor \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --region=asia-northeast1
```

### Vision API認証

本番環境では、APIキーの代わりにサービスアカウントの使用を推奨：

```bash
# サービスアカウント作成
gcloud iam service-accounts create photo-extractor-sa \
  --display-name="Photo Info Extractor Service Account"

# Vision API権限を付与
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:photo-extractor-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/ml.developer"
```

## 監視とログ

- Cloud Loggingでアプリケーションログを確認
- Cloud Monitoringでパフォーマンス監視
- Error Reportingでエラー追跡

## コスト最適化

- Cloud Runの最小インスタンス数: 0（コールドスタート許容）
- 最大インスタンス数: 10（トラフィックに応じて調整）
- メモリ: 1GB（画像処理に十分）
- CPU: 1vCPU（軽量なワークロード用）
