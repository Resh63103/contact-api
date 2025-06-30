import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import winston from 'winston';
import { appendToSheet } from './googleSheets.js';
import { sendSlackNotification } from './slack.js';

// 環境変数読み込み
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// ロガー設定
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// CORS対応
app.use(cors());
// JSONボディパース
app.use(express.json());

// APIキー認証ミドルウェア
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    logger.warn('Unauthorized access attempt', { ip: req.ip });
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// POST /contact
app.post('/contact', async (req, res) => {
  const { name, email, company, subject, message } = req.body;
  logger.info('Received contact', { body: req.body });

  // Google Sheets
  const sheetResult = await appendToSheet({
    serviceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    values: [name, email, company, subject, message],
    sheetName: 'contact'
  });
  if (!sheetResult.success) {
    logger.error('Google Sheets連携失敗', { error: sheetResult.error });
  }

  // Slack通知
  const slackText = `新しいお問い合わせ\n名前: ${name}\nメール: ${email}\n会社: ${company}\n件名: ${subject}\n内容: ${message}`;
  const slackResult = await sendSlackNotification({
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
    text: slackText,
  });
  if (!slackResult.success) {
    logger.error('Slack通知失敗', { error: slackResult.error });
  }

  // レスポンス
  res.status(200).json({
    googleSheets: sheetResult.success,
    slack: slackResult.success,
    errors: [
      sheetResult.success ? null : 'Google Sheets',
      slackResult.success ? null : 'Slack',
    ].filter(Boolean)
  });
});

// エラーハンドリング
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err });
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
}); 