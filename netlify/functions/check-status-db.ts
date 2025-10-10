import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { supabase } from './supabase'

interface StatusRequest {
  api_key: string
  email: string
  transaction_request_id: string
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  // Allow both GET and POST requests
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    let transaction_request_id: string

    // Get transaction ID from path parameter (GET) or body (POST)
    if (event.httpMethod === 'GET') {
      // Extract from path: /check-status-db/{transaction_id}
      const pathParts = event.path.split('/')
      transaction_request_id = pathParts[pathParts.length - 1]
    } else {
      // Parse from POST body
      const body: StatusRequest = JSON.parse(event.body || '{}')
      transaction_request_id = body.transaction_request_id
    }

    // Validate transaction ID
    if (!transaction_request_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing transaction_request_id'
        }),
      }
    }

    console.log('Checking transaction status in database:', transaction_request_id)

    // Query database for transaction status
    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .select('*')
      .eq('transaction_request_id', transaction_request_id)
      .single()

    if (dbError) {
      console.error('Database query error:', dbError)
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: 'Transaction not found'
        }),
      }
    }

    // Return the status data in the format expected by frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        payment: {
          status: transaction.status, // 'success', 'failed', 'cancelled', 'pending'
          amount: transaction.amount,
          phoneNumber: transaction.phone,
          mpesaReceiptNumber: transaction.receipt_number,
          resultDesc: transaction.result_description,
          resultCode: transaction.result_code,
          timestamp: transaction.updated_at,
        }
      }),
    }
  } catch (error) {
    console.error('Status check error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}

export { handler }
