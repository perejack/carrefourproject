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
    const { transaction_request_id } = JSON.parse(event.body || '{}')

    if (!transaction_request_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing transaction_request_id' }),
      }
    }

    // PesaFlux API credentials
    const apiKey = 'PSFXPCGLCY37'
    const email = 'silverstonesolutions103@gmail.com'

    // Check status directly from PesaFlux API
    const response = await fetch('https://api.pesaflux.co.ke/v1/checkstatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        email: email,
        transaction_request_id: transaction_request_id,
      }),
    })

    const result = await response.json()
    console.log('PesaFlux API response:', result)

    // Determine status based on response
    let status: 'success' | 'failed' | 'cancelled' | 'pending' = 'pending'
    
    if (result.ResultCode === '0' || result.ResultCode === 0) {
      status = 'success'
    } else if (result.ResultCode === '1032' || result.ResultCode === 1032 || result.ResultCode === '1' || result.ResultCode === 1) {
      status = 'cancelled'
    } else if (result.ResultCode && result.ResultCode !== '1037') {
      status = 'failed'
    }

    // Update database with the status
    if (status !== 'pending') {
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: status,
          result_code: result.ResultCode?.toString(),
          result_description: result.ResultDesc || result.massage || result.message,
          receipt_number: result.TransactionReceipt !== 'N/A' ? result.TransactionReceipt : null,
          transaction_id: result.TransactionID,
          updated_at: new Date().toISOString(),
        })
        .eq('transaction_request_id', transaction_request_id)

      if (updateError) {
        console.error('Database update error:', updateError)
      } else {
        console.log('Transaction updated from PesaFlux API:', transaction_request_id, 'Status:', status)
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        status: status,
        details: result,
      }),
    }
  } catch (error) {
    console.error('PesaFlux status check error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to check status' }),
    }
  }
}

export { handler }
