
import prisma from '$lib/prisma';
import type { Account, Category, Transaction } from '@prisma/client';
import { error, json } from '@sveltejs/kit';

export interface LiftedTransaction extends Transaction {
  account: Pick<Account, 'id' | 'name'>;
  category: Pick<Category, 'id' | 'name' | 'color'>;
}

export async function POST({ request }) {
  const data = await request.json();

  const transaction = await prisma.transaction.create({ data })

  return json(transaction)
}

export async function GET({ url }) {
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

  const transactions: LiftedTransaction[] = await prisma.transaction.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      account: {
        select: {
          id: true,
          name: true,
        },
      }
    },
    orderBy: {
      recordedAt: 'desc',
    },
    where: {
      recordedAt: {
        // Check if the start_date is provided and filter transactions after or on the startDate
        ...(startDate && { gte: startDate }),

        // Check if the end_date is provided and filter transactions before or on the endDate
        ...(endDate && { lt: dayAfterEndDate }),
      },
    }
  })

  return json(transactions)
}

export async function DELETE({ url }) {
  const transactionId = url.searchParams.get('id')

  if (!transactionId) {
    throw error(400, 'Missing transaction ID');
  }

  await prisma.transaction.delete({
    where: {
      id: Number(transactionId)
    }
  })

  return json('Transaction deleted')
}