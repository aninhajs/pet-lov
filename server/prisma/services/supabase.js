import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase: faltando SUPABASE_URL ou SUPABASE_KEY nas variáveis de ambiente')
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '')