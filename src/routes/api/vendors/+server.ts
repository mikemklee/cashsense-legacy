import { error, json } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';

export async function POST({ request, locals: { supabase, getSession } }) {
  const session = await getSession()
  if (!session) {
    throw error(401, 'Unauthorized');
  }

  const { name } = await request.json();

  const {
    data,
    error: insertError,
    status: statusCode,
  } = await supabase
    .from('vendors')
    .insert({
      id: uuid(),
      name: name,
      profile_id: session?.user.id,
    })
    .select()

  if (insertError) {
    throw error(statusCode, 'Unexpected error while adding new vendor')
  } else {
    return json(data)
  }
}

export async function GET({ locals: { supabase } }) {
  const { data: vendors } = await supabase
    .from('vendors')
    .select(`*`)

  return json(vendors)
}

export async function DELETE({ url, locals: { supabase, getSession } }) {
  const session = await getSession()
  if (!session) {
    throw error(401, 'Unauthorized');
  }

  const vendorId = url.searchParams.get('id')
  if (!vendorId) {
    throw error(400, 'Missing vendor ID');
  }

  const {
    error: deleteError,
    status: statusCode,
  } = await supabase.from('vendors')
    .delete()
    .eq('id', vendorId)
    .eq('profile_id', session?.user.id)

  if (deleteError) {
    throw error(statusCode, 'Unexpected error while deleting vendor')
  } else {
    return json('Vendor deleted')
  }
}