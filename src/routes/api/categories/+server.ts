import { error, json } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';

export async function POST({ request, locals: { supabase, getSession } }) {
  const session = await getSession()
  if (!session) {
    throw error(401, 'Unauthorized');
  }

  const { name, color } = await request.json();

  const {
    data,
    error: insertError,
    status: statusCode,
  } = await supabase
    .from('categories')
    .insert({
      id: uuid(),
      name,
      color,
      profile_id: session.user.id,
    })

  if (insertError) {
    throw error(statusCode, 'Unexpected error while adding new category')
  } else {
    return json(data)
  }
}

export async function PATCH({ request, locals: { supabase, getSession } }) {
  const session = await getSession()
  if (!session) {
    throw error(401, 'Unauthorized');
  }

  const { id, name, color } = await request.json();

  const {
    data,
    error: updateError,
    status: statusCode,
  } = await supabase
    .from('categories')
    .update({
      name,
      color,
    })
    .eq('id', id)
    .eq('profile_id', session.user.id)

  if (updateError) {
    throw error(statusCode, 'Unexpected error while updating category')
  } else {
    return json(data)
  }

}

export async function GET({ locals: { supabase } }) {

  const { data: categories } = await supabase
    .from('categories')
    .select(`*`)

  return json(categories)
}

export async function DELETE({ url, locals: { supabase, getSession } }) {
  const session = await getSession()
  if (!session) {
    throw error(401, 'Unauthorized');
  }

  const categoryId = url.searchParams.get('id')
  if (!categoryId) {
    throw error(400, 'Missing category ID');
  }

  const {
    error: deleteError,
    status: statusCode,
  } = await supabase.from('categories')
    .delete()
    .eq('id', categoryId)
    .eq('profile_id', session.user.id)

  if (deleteError) {
    throw error(statusCode, 'Unexpected error while deleting category')
  } else {
    return json('Category deleted')
  }
}