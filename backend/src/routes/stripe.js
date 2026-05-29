import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });

// POST /api/stripe/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Montant invalide' });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100), // centimes
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: { source: 'ridenow-vtc' },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('[Stripe] create-payment-intent error:', err.message);
    res.status(500).json({ error: 'Impossible de créer le paiement Stripe' });
  }
});

export default router;
