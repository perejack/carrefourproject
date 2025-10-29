// Vercel Serverless Function - Check payment status from database
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get transaction ID from URL parameter
    const { txnId } = req.query;

    if (!txnId) {
      return res.status(400).json({ 
        error: 'Transaction ID is required',
        success: false
      });
    }

    // TODO: Replace this with your actual database query
    // Example: Query Supabase, MongoDB, PostgreSQL, etc.
    
    /*
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', txnId)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    return res.status(200).json({
      success: true,
      payment: {
        transaction_id: data.transaction_id,
        status: data.status, // 'pending', 'success', 'failed', 'cancelled'
        amount: data.amount,
        phone: data.phone,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    });
    */

    // For now, return a placeholder response
    // IMPORTANT: Replace this with actual database query
    console.log('Checking payment status for transaction:', txnId);

    return res.status(200).json({
      success: true,
      payment: {
        transaction_id: txnId,
        status: 'pending', // Change to 'success', 'failed', or 'cancelled' based on actual status
        amount: 139,
        phone: '254XXXXXXXXX',
        message: 'DEMO MODE - Replace with actual database query'
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to check payment status',
      success: false
    });
  }
}
