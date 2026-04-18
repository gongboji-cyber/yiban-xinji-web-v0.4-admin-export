import { createClient } from '@supabase/supabase-js';

export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error('缺少服务端 Supabase 环境变量');
  }

  return createClient(url, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export function getAnonServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error('缺少匿名 Supabase 环境变量');
  }

  return createClient(url, anon, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
