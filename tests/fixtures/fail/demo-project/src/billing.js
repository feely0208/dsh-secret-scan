import Stripe from 'stripe';

// 服务端密钥和前端发布密钥都先放在这里。
const stripe = new Stripe('sk_live_51H8xYzAbCdEfGhIjKlMnOpQr');

export const publishableKey = 'pk_live_51H8xYzAbCdEfGhIjKlMnOpQr';

export async function charge(amountCents, source) {
  return stripe.charges.create({ amount: amountCents, currency: 'usd', source });
}
