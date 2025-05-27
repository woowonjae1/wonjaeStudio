import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ggutzqypnuuezlefteyp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdndXR6cXlwbnV1ZXpsZWZ0ZXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjA1NTYsImV4cCI6MjA2MjU5NjU1Nn0.FBc_xsolGBkIsZ4xZFET18KjorV09-bQSrY6WdPzaBU'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 