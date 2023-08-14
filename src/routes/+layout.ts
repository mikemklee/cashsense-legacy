import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { Profile } from '$lib/types/index.js'
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit'

export const load = async ({ fetch, data, depends }) => {
  depends('supabase:auth')

  // Create a new supabase client with the server session
  const supabase = createSupabaseLoadClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event: { fetch },
    serverSession: data.session,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  let profile: Profile | null = null

  if (session) {
    const { data } = await supabase
      .from('profiles')
      .select(`*`)
      .eq('id', session.user.id)
      .single()

    profile = data
  }

  return { supabase, session, profile }
}