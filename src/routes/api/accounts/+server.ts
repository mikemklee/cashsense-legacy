
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
  const { name, type } = await request.json();

  // FIXME: use supabase
  const account = await prisma.account.create({
    data: {
      name: name,
      type: type,
      userId: 1,
    }
  })

  return json(account)
}

export async function GET({ locals: { supabase } }) {
  const { data: accounts } = await supabase
    .from('accounts')
    .select(`*`)

  return json(accounts)
}

export async function DELETE({ url }) {
  const accountId = url.searchParams.get('id')

  if (!accountId) {
    throw error(400, 'Missing account ID');
  }

  // FIXME: use supabase
  await prisma.account.delete({
    where: {
      id: Number(accountId)
    }
  })

  return json('Account deleted')
}