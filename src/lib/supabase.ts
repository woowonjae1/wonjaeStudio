import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ggutzqypnuuezlefteyp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdndXR6cXlwbnV1ZXpsZWZ0ZXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjA1NTYsImV4cCI6MjA2MjU5NjU1Nn0.FBc_xsolGBkIsZ4xZFET18KjorV09-bQSrY6WdPzaBU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 