const SLACK_BOT_TOKEN = 'xoxb-123456789012-1234567890123-AbCdEfGhIjKlMnOpQrStUvWx';
const SLACK_WEBHOOK_PATH = '/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';

export async function notify(channel, text) {
  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
    },
    body: JSON.stringify({ channel, text }),
  });
  if (!res.ok) throw new Error(`slack notify failed: ${res.status}`);
  return res.json();
}

export function webhookUrl(base) {
  return base.replace(/\/$/, '') + SLACK_WEBHOOK_PATH;
}
