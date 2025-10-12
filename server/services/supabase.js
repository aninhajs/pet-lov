import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY

if (!url) throw new Error('Faltou SUPABASE_URL no .env')
if (!key) throw new Error('Faltou SUPABASE_SERVICE_KEY (ou ANON) no .env')

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
})