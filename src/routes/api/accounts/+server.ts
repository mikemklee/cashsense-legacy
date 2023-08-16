
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase, getSession } }) {
  const session = await getSession()

  if (!session) {
    throw error(401, 'Unauthorized');
  }

  const { name, type } = await request.json();

  const account = await supabase.from('accounts').insert({
    name: name,
    type: type,
    profile_id: session?.user.id,
  })

  return json(account)
}

export async function GET({ locals: { supabase } }) {
  const { data: accounts } = await supabase
    .from('accounts')
    .select(`*`)

  return json(accounts)
}

export async function DELETE({ url, locals: { supabase, getSession } }) {
  const session = await getSession()

  if (!session) {
    throw error(401, 'Unauthorized');
  }


  const accountId = url.searchParams.get('id')

  if (!accountId) {
    throw error(400, 'Missing account ID');
  }

  await supabase.from('accounts')
    .delete()
    .eq('id', Number(accountId))
    .eq('profile_id', session?.user.id)

  return json('Account deleted')
}