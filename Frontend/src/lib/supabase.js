import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const skipAuth = import.meta.env.VITE_SKIP_AUTH === 'true'

if (!skipAuth && (!supabaseUrl || !supabasePublishableKey)) {
  throw new Error('Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en Frontend/.env')
}

export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabasePublishableKey || 'demo-publishable-key',
  {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  },
)