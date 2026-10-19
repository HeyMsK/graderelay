const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Not signed in' });

    const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data: userData, error: userError } = await supa.auth.getUser(token);
    if (userError || !userData?.user) return res.status(401).json({ error: 'Not signed in' });

    const { data: profile } = await supa
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userData.user.id)
      .maybeSingle();

    if (!profile?.stripe_customer_id) {
      return res.status(400).json({ error: 'No billing account found for this user' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: 'https://graderelay.com',
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Billing portal error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
