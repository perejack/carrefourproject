// Vercel Serverless Function - Check PesaFlux API status directly
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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
    const { transaction_request_id } = req.body;

    if (!transaction_request_id) {
      return res.status(400).json({ 
        error: 'Transaction request ID is required',
        success: false
      });
    }

    // TODO: Replace this with your actual PesaFlux API integration
    // Make sure to add your PesaFlux API credentials to Vercel environment variables
    
    /*
    const response = await fetch('PESAFLUX_STATUS_CHECK_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PESAFLUX_API_KEY}`,
        // Add other required headers
      },
      body: JSON.stringify({
        transaction_request_id: transaction_request_id
      })
    });

    const data = await response.json();

    // Update your database with the latest status
    // await updatePaymentStatus(transaction_request_id, data.status);

    return res.status(200).json({
      success: true,
      status: data.status,
      transaction_id: transaction_request_id,
      data: data
    });
    */

    // For now, return a placeholder response
    // IMPORTANT: Replace this with actual PesaFlux API call
    console.log('Checking PesaFlux status for transaction:', transaction_request_id);

    return res.status(200).json({
      success: true,
      status: 'pending',
      transaction_id: transaction_request_id,
      message: 'DEMO MODE - Replace with actual PesaFlux API call'
    });

  } catch (error) {
    console.error('PesaFlux status check error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to check PesaFlux status',
      success: false
    });
  }
}
