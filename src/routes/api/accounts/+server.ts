
import prisma from '$lib/prisma';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
  const { name, type } = await request.json();

  const account = await prisma.account.create({
    data: {
      name: name,
      type: type,
      userId: 1,
    }
  })

  return json(account)
}

export async function GET() {
  const accounts = await prisma.account.findMany()

  return json(accounts)
}

export async function DELETE({ url }) {
  const accountId = url.searchParams.get('id')

  if (!accountId) {
    throw error(400, 'Missing account ID');
  }

  await prisma.account.delete({
    where: {
      id: Number(accountId)
    }
  })

  return json('Account deleted')
}