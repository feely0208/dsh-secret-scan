import express from 'express';
import { notify } from './notify.js';
import { config } from './config.js';

const app = express();
app.use(express.json());

app.post('/hooks/payment', async (req, res) => {
  const { channel, text } = req.body;
  await notify(channel, text);
  res.json({ ok: true, region: config.aws.region });
});

app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));

const port = Number(process.env.PORT ?? 8080);
app.listen(port, () => {
  console.log(`acme-notify-service listening on :${port}`);
});
