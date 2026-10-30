import { createLocalSupabase } from './localDb.js'

// Modo 100% Local / Offline sem necessidade de Supabase externo
export const supabase = createLocalSupabase()
export const supabaseAdmin = supabase
