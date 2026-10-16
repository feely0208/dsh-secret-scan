import express from 'express';
import { config, secretKey } from './config.js';

const app = express();

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', awsConfigured: Boolean(config.awsAccessKeyId) });
});

app.post('/token', (_req, res) => {
  // 签名密钥来自环境变量；这里只演示读取方式。
  res.json({ signed: Boolean(secretKey) });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`acme-billing-web listening on :${port}`));
