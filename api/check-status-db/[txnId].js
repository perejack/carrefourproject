export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { txnId } = req.query;

    if (!txnId) {
      return res.status(400).json({ 
        error: 'Missing transaction ID',
        success: false 
      });
    }

    // Check Supabase for payment status - hardcoded credentials
    const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', txnId)
      .single();

    if (error) {
      console.error('Database query error:', error);
      return res.status(404).json({ 
        error: 'Payment not found',
        success: false 
      });
    }

    return res.status(200).json({
      success: true,
      payment: {
        transaction_id: data.transaction_id,
        status: data.status,
        amount: data.amount,
        msisdn: data.msisdn,
        reference: data.reference,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    });
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to check payment status',
      success: false 
    });
  }
}
