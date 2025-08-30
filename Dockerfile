# Node.jsイメージを使用
FROM node:20-alpine AS builder

# 作業ディレクトリを作成
WORKDIR /app

# パッケージファイルをコピーして依存関係をインストール
COPY package.json package-lock.json* ./
RUN npm install

# アプリケーションソースをコピー
COPY . .

# ビルド
RUN npm run build

# 実行用の軽量イメージ
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
