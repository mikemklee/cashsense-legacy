import { json, redirect } from '@sveltejs/kit'

export const POST = async ({ locals: { supabase } }) => {
  await supabase.auth.signOut()
  throw redirect(303, '/')
}