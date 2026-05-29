import express from 'express';
import axios from 'axios';

const router = express.Router();

const PAYPAL_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const { data } = await axios.post(
    `${PAYPAL_BASE}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );
  return data.access_token;
}

// POST /api/paypal/create-order
router.post('/create-order', async (req, res) => {
  const { amount, reference } = req.body;
  if (!amount || !reference) {
    return res.status(400).json({ error: 'Montant et référence requis' });
  }
  try {
    const token = await getAccessToken();
    const { data } = await axios.post(
      `${PAYPAL_BASE}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: reference,
          description: `RideNow VTC — Réf. ${reference}`,
          amount: {
            currency_code: 'EUR',
            value: parseFloat(amount).toFixed(2),
          },
        }],
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    res.json({ id: data.id });
  } catch (err) {
    console.error('[PayPal] create-order error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Impossible de créer la commande PayPal' });
  }
});

// POST /api/paypal/capture-order/:orderId
router.post('/capture-order/:orderId', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { data } = await axios.post(
      `${PAYPAL_BASE}/v2/checkout/orders/${req.params.orderId}/capture`,
      {},
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    const capture = data.purchase_units[0]?.payments?.captures?.[0];
    res.json({
      status: data.status,
      captureId: capture?.id,
      amount: capture?.amount?.value,
    });
  } catch (err) {
    console.error('[PayPal] capture-order error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Impossible de capturer le paiement PayPal' });
  }
});

export default router;
