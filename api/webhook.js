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
  const PRICE_FOUNDING = process.env.PRICE_FOUNDING || 'price_1TJGJT3NEEAPPVNgF5Vn68JM';

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const priceId = session.metadata?.priceId;
      const email = session.customer_details?.email || session.customer_email || null;
      if (!userId) {
        console.warn('checkout completed with no userId', session.id);
        return res.status(200).json({ received: true, note: 'no userId' });
      }

      const plan = priceId === PRICE_FOUNDING ? 'founding' : 'pro';

      // 1. Set the plan. Create the row if it doesn't exist yet.
      const { error: planError } = await supa.from('profiles').upsert(
        { id: userId, email, plan },
        { onConflict: 'id' }
      );
      if (planError) {
        console.error('Plan update failed for', userId, planError.message);
        return res.status(500).json({ error: 'Plan update failed', detail: planError.message });
      }

      // 2. Optional extra fields. Failure here should not block the plan.
      const { error: extraError } = await supa.from('profiles').update({
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription || null,
        plan_updated_at: new Date().toISOString(),
      }).eq('id', userId);
      if (extraError) console.warn('Extra fields not saved:', extraError.message);

      console.log(`Updated user ${userId} to plan: ${plan}`);
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const { data: row, error: findError } = await supa.from('profiles')
        .select('id').eq('stripe_subscription_id', sub.id).maybeSingle();
      if (findError) throw new Error(findError.message);
      if (row) {
        const { error: downError } = await supa.from('profiles').update({ plan: 'free' }).eq('id', row.id);
        if (downError) throw new Error(downError.message);
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err.message);
    return res.status(500).json({ error: err.message });
  }

  return res.status(200).json({ received: true });
}

handler.config = { api: { bodyParser: false } };
module.exports = handler;
