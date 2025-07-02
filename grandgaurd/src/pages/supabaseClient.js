import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ldgrzfhepwuijbopqrnq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZ3J6ZmhlcHd1aWpib3Bxcm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODQ0NzMsImV4cCI6MjA2MzA2MDQ3M30.mxsPykix3WXFw9X-rNsVv6RNoSkJaahxppoEo43glSE'

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

export default supabase; 