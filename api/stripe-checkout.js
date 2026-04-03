const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { priceId, userId, email } = req.body || {};
  if (!priceId || !userId) return res.status(400).json({ error: 'Missing required fields' });

  const isOneTime = priceId === process.env.PRICE_FOUNDING;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isOneTime ? 'payment' : 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.SITE_URL || 'https://graderelay.com'}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL || 'https://graderelay.com'}?payment=cancelled`,
      customer_email: email,
      metadata: { userId, priceId },
      allow_promotion_codes: true,
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
