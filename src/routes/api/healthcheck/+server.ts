import { json } from '@sveltejs/kit'

export async function GET({ locals: { supabase } }) {
  await supabase
    .from('accounts')
    .select(`*`)

  return json({
    message: 'Server is up and running!'
  })
}