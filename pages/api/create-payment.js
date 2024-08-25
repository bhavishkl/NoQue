import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('Razorpay key ID:', process.env.RAZORPAY_KEY_ID);
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      console.log('Creating payment with amount:', req.body.amount);
      const payment = await razorpay.orders.create({
        amount: req.body.amount * 100, // Convert to paise
        currency: 'INR',
        receipt: 'receipt_' + Math.random().toString(36).substring(7),
        payment_capture: 1,
        notes: {
          payment_type: 'queue_join'
        }
      });
      
      console.log('Payment created:', payment);
      res.status(200).json(payment);
    } catch (error) {
      console.error('Razorpay error:', error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}