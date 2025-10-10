import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { supabase } from './supabase'

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    // Get the phone number from query parameter
    const phone = event.queryStringParameters?.phone || ''

    // Get all recent transactions
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Database error', details: error }),
      }
    }

    // If phone provided, filter by phone
    let filteredTransactions = transactions
    if (phone) {
      filteredTransactions = transactions?.filter(t => t.phone?.includes(phone.replace(/^0/, '254'))) || []
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: filteredTransactions?.length || 0,
        transactions: filteredTransactions,
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error', message: error instanceof Error ? error.message : 'Unknown' }),
    }
  }
}

export { handler }
