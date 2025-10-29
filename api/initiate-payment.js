export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { msisdn, amount, email, reference } = req.body;

    if (!msisdn || !amount || !reference) {
      return res.status(400).json({ 
        error: 'Missing required fields: msisdn, amount, reference' 
      });
    }

    // PesaFlux API credentials - hardcoded for testing
    const PESAFLUX_API_KEY = 'PSFXyLBOrRV9';

    // Call PesaFlux API
    const pesafluxResponse = await fetch('https://api.pesaflux.com/v1/payments/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: PESAFLUX_API_KEY,
        msisdn: msisdn,
        amount: amount,
        email: email || 'frankyfreaky103@gmail.com',
        reference: reference,
        callback_url: `${process.env.VERCEL_URL || 'https://yourdomain.com'}/api/payment-callback`,
      }),
    });

    const data = await pesafluxResponse.json();

    if (pesafluxResponse.ok && data.transaction_request_id) {
      // Store in database (Supabase) - hardcoded credentials
      const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';
      
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase.from('payments').insert({
          transaction_id: data.transaction_request_id,
          msisdn: msisdn,
          amount: amount,
          email: email,
          reference: reference,
          status: 'pending',
          created_at: new Date().toISOString(),
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue even if DB insert fails
      }

      return res.status(200).json({
        success: '200',
        transaction_request_id: data.transaction_request_id,
        message: 'Payment initiated successfully',
      });
    } else {
      throw new Error(data.error || 'Failed to initiate payment');
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to initiate payment',
      success: 'false'
    });
  }
}
