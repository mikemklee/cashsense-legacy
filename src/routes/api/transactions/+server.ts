
import { error, json } from '@sveltejs/kit';

import type { LiftedTransaction } from '$lib/types';

export async function POST({ request }) {
  const data = await request.json();

  // FIXME: use supabase
  const transaction = await prisma.transaction.create({ data })

  return json(transaction)
}

export async function GET({ url, locals: { supabase } }) {
  // Get query parameters from the URL
  const startDateParam = url.searchParams.get('startDate');
  const endDateParam = url.searchParams.get('endDate');

  // Parse and validate the query parameters
  const startDate = startDateParam ? new Date(startDateParam) : null;
  const endDate = endDateParam ? new Date(endDateParam) : null;

  // Check if the dates are valid
  if (startDateParam && !startDate) {
    throw error(400, 'Invalid startDate');
  }

  if (endDateParam && !endDate) {
    throw error(400, 'Invalid endDate');
  }

  // to ensure end date is inclusive
  const dayAfterEndDate = new Date(endDate!.getTime() + 24 * 60 * 60 * 1000);

  let query = supabase
    .from('transactions')
    .select(`
      *,
      account:accounts (id, name),
      category:categories (id, name, color)
    `)

  if (startDate) {
    // Check if the start_date is provided and filter transactions after or on the startDate
    query = query.gte('posted_at', startDate.toISOString())
  }

  if (endDate) {
    // Check if the end_date is provided and filter transactions before or on the endDate
    query = query.lt('posted_at', dayAfterEndDate.toISOString())
  }

  query = query.order('posted_at', { ascending: false })

  const { data: transactions } = await query.returns<LiftedTransaction[]>()

  return json(transactions)
}

export async function DELETE({ url }) {
  const transactionId = url.searchParams.get('id')

  if (!transactionId) {
    throw error(400, 'Missing transaction ID');
  }

  // FIXME: use supabase
  await prisma.transaction.delete({
    where: {
      id: Number(transactionId)
    }
  })

  return json('Transaction deleted')
}