// Vercel Serverless Function - Replace Netlify function
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { msisdn, amount, email, reference } = req.body;

    // Validate required fields
    if (!msisdn || !amount || !reference) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        success: 'false'
      });
    }

    // TODO: Replace this with your actual payment provider integration
    // Example: PesaFlux, M-Pesa, or other payment gateway
    
    // Example implementation (replace with your actual API):
    /*
    const response = await fetch('YOUR_PAYMENT_PROVIDER_API_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAYMENT_API_KEY}`
      },
      body: JSON.stringify({
        phone: msisdn,
        amount: amount,
        reference: reference,
        email: email
      })
    });

    const data = await response.json();
    
    if (data.success) {
      return res.status(200).json({
        success: '200',
        transaction_request_id: data.transaction_id,
        message: 'Payment initiated successfully'
      });
    }
    */

    // For now, return a placeholder response
    // IMPORTANT: Replace this with actual payment provider logic
    console.log('Payment initiation request:', { msisdn, amount, email, reference });
    
    return res.status(200).json({
      success: '200',
      transaction_request_id: `TXN-${Date.now()}`,
      message: 'Payment initiated (DEMO MODE - Replace with actual payment provider)'
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to initiate payment',
      success: 'false'
    });
  }
}
