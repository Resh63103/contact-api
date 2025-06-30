# ベースイメージ
FROM node:20-alpine

# 作業ディレクトリ作成
WORKDIR /app

# 依存ファイルをコピー
COPY package*.json ./

# 依存パッケージインストール
RUN npm install --production

# アプリ本体をコピー
COPY . .

# ポート指定（Cloud Runのデフォルト）
ENV PORT=8080
EXPOSE 8080

# サーバー起動
CMD ["npm", "start"] 