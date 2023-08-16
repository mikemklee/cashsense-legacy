import { error, json } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';

export async function POST({ request, locals: { supabase, getSession } }) {
  const session = await getSession()
  if (!session) {
    throw error(401, 'Unauthorized');
  }

  const { name, type } = await request.json();

  const {
    data,
    error: insertError,
    status: statusCode,
  } = await supabase
    .from('accounts')
    .insert({
      id: uuid(),
      name: name,
      type: type,
      profile_id: session?.user.id,
    })

  if (insertError) {
    throw error(statusCode, 'Unexpected error while adding new account')
  } else {
    return json(data)
  }
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

  const {
    error: deleteError,
    status: statusCode,
  } = await supabase.from('accounts')
    .delete()
    .eq('id', accountId)
    .eq('profile_id', session?.user.id)

  if (deleteError) {
    throw error(statusCode, 'Unexpected error while deleting account')
  } else {
    return json('Account deleted')
  }
}