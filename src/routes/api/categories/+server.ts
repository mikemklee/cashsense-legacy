
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
  const { name, color } = await request.json();

  // FIXME: use supabase
  const category = await prisma.category.create({
    data: {
      name,
      color,
      userId: 1,
    }
  })

  return json(category)
}

export async function PATCH({ request }) {
  const { id, name, color } = await request.json();

  // FIXME: use supabase
  const category = await prisma.category.update({
    where: {
      id: Number(id)
    },
    data: {
      name,
      color,
    }
  })

  return json(category)
}

export async function GET({ locals: { supabase } }) {

  const { data: categories } = await supabase
    .from('categories')
    .select(`*`)

  return json(categories)
}

export async function DELETE({ url }) {
  const categoryId = url.searchParams.get('id')

  if (!categoryId) {
    throw error(400, 'Missing category ID');
  }

  // FIXME: use supabase
  await prisma.category.delete({
    where: {
      id: Number(categoryId)
    }
  })

  return json('Category deleted')
}