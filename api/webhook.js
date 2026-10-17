const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const priceId = session.metadata?.priceId;
    if (!userId) return res.status(200).json({ received: true });

    const PRICE_FOUNDING = process.env.PRICE_FOUNDING || 'price_1TJGJT3NEEAPPVNgF5Vn68JM';

    let plan = 'pro';
    if (priceId === PRICE_FOUNDING) plan = 'founding';

    await supa.from('profiles').update({
      plan,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription || null,
      plan_updated_at: new Date().toISOString(),
    }).eq('id', userId);

    console.log(`Updated user ${userId} to plan: ${plan}`);
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    const { data: profiles } = await supa.from('profiles')
      .select('id').eq('stripe_subscription_id', sub.id).single();
    if (profiles) {
      await supa.from('profiles').update({ plan: 'free' }).eq('id', profiles.id);
    }
  }

  return res.status(200).json({ received: true });
};

handler.config = { api: { bodyParser: false } };
module.exports = handler;
