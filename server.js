require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

const AIRWALLEX_API_KEY = process.env.AIRWALLEX_SECRET;

app.use(bodyParser.json());

app.post('/create-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const result = await axios.post(
      'https://api.airwallex.com/api/v1/pa/payment_intents/create',
      {
        amount,
        currency,
        merchant_order_id: 'SNAP-' + Date.now(),
        request_id: 'REQ-' + Date.now(),
      },
      {
        headers: {
          Authorization: `Bearer ${AIRWALLEX_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ client_secret: result.data.client_secret });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Payment intent failed' });
  }
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
