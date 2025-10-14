import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { supabase } from './supabase'

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  try {
    // Get the transaction ID from the request
    const { transaction_id } = JSON.parse(event.body || '{}')

    if (!transaction_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing transaction_id' }),
      }
    }

    // Update the transaction to success
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'success',
        result_code: '0',
        result_description: 'Payment completed successfully (manual)',
        receipt_number: `TEST${Date.now()}`,
        updated_at: new Date().toISOString(),
      })
      .eq('transaction_request_id', transaction_id)

    if (updateError) {
      console.error('Manual update error:', updateError)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to update transaction' }),
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Transaction marked as successful',
        transaction_id 
      }),
    }
  } catch (error) {
    console.error('Manual success error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}

export { handler }
