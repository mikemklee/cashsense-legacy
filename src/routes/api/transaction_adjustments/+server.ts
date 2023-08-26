import { error, json } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';

import type { TransactionAdjustment } from '$lib/types/index.js';

export async function GET({ url, locals: { supabase, getSession } }) {
  const session = await getSession()
  if (!session) {
    throw error(401, 'Unauthorized');
  }

  const transactionId = url.searchParams.get('id')
  if (!transactionId) {
    throw error(400, 'Missing transaction ID');
  }

  // TODO: tighten row access policy to only allow access to transactions that belong to the user
  let query = supabase
    .from('transaction_adjustments')
    .select('*')
    .eq('transaction_id', transactionId)
    .order('created_at', { ascending: false })

  const { data: transaction_adjustments, error: fetchError } = await query.returns<TransactionAdjustment[]>()

  if (fetchError) {
    throw error(500, 'Unexpected error while loading transaction adjustments')
  } else {
    return json(transaction_adjustments)
  }
}

export async function PUT({ request, locals: { supabase, getSession } }) {
  const session = await getSession()
  if (!session) {
    throw error(401, 'Unauthorized');
  }

  const adjustments = await request.json();
  console.log(adjustments)

  // bulk upsert
  const {
    data,
    error: upsertError,
    status: statusCode,
  } = await supabase
    .from('transaction_adjustments')
    .upsert(adjustments)

  if (upsertError) {
    console.error(upsertError)
    throw error(statusCode, 'Unexpected error while upserting transaction adjustments')
  } else {
    return json(data)
  }

}