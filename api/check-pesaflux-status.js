export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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
    const { transaction_request_id } = req.body;

    if (!transaction_request_id) {
      return res.status(400).json({ 
        error: 'Missing transaction_request_id',
        success: false 
      });
    }

    // PesaFlux API credentials - hardcoded for testing
    const PESAFLUX_API_KEY = 'PSFXyLBOrRV9';

    // Check payment status with PesaFlux
    const pesafluxResponse = await fetch(
      `https://api.pesaflux.com/v1/payments/status/${transaction_request_id}?api_key=${PESAFLUX_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await pesafluxResponse.json();

    if (pesafluxResponse.ok) {
      // Update database with latest status - hardcoded credentials
      const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';
      
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase
          .from('payments')
          .update({
            status: data.status,
            updated_at: new Date().toISOString(),
          })
          .eq('transaction_id', transaction_request_id);
      } catch (dbError) {
        console.error('Database update error:', dbError);
      }

      return res.status(200).json({
        success: true,
        payment: {
          transaction_id: transaction_request_id,
          status: data.status,
          ...data,
        },
      });
    } else {
      throw new Error(data.error || 'Failed to check payment status');
    }
  } catch (error) {
    console.error('PesaFlux status check error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to check payment status',
      success: false 
    });
  }
}
