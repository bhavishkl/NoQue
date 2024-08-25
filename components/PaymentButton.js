import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function PaymentButton({ amount, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
      console.log('Razorpay script loaded');
    };
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      alert('Razorpay SDK is still loading. Please try again in a moment.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
      }

      const data = await response.json();
      console.log('Payment creation response:', data);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'NoQue',
        description: 'Payment for joining queue',
        order_id: data.id,
        handler: function (response) {
          console.log('Payment successful:', response);
          onPaymentSuccess(response.razorpay_payment_id);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#6f6cd3', // Shade one for PaymentButton
          backdrop: 'rgba(255, 255, 255, 0.1)', // Transparent white for glass effect
        },
        method: {
          upi: true,        // Ensure UPI is enabled
          card: true,       // Enable card payments
          netbanking: true, // Enable net banking
          wallet: true      // Enable wallets
        },
        modal: {
          backdropClose: true,
          escape: true,
          animation: true,
          backdropColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black for glassmorphism backdrop
        }
      };

      console.log('Razorpay options:', options);

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert('Payment failed. ' + response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.error('Error details:', error);
      alert('Error creating payment. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <button
        onClick={handlePayment}
        disabled={loading || !scriptLoaded}
        className="bg-[#6f6cd3] text-white px-6 py-2 rounded hover:bg-[#3532a7] transition duration-200 w-full sm:w-auto"
      >
        {loading ? 'Processing...' : 'Join Queue'}
      </button>
    </>
  );
}