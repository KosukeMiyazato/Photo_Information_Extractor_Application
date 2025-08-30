# ベースイメージ
FROM node:20-alpine

# 作業ディレクトリを作成
WORKDIR /app

# 依存関係を先にコピーしてインストール（キャッシュ用）
COPY package*.json ./
RUN npm install --legacy-peer-deps

# ソースコードをコピー
COPY . .

# Next.js をビルド
RUN npm run build

# 本番環境で実行
EXPOSE 3000
CMD ["npm", "start"]
