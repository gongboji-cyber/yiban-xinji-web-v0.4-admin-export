'use client';

import Link from 'next/link';
import { siteMeta } from '@/lib/content';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import { useEffect, useState } from 'react';

export default function Header() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    let mounted = true;
    const supabase = getBrowserSupabase();
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setEmail(data.user?.email || '');
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email || '');
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link href="/" className="brand">
          <span className="brand-dot" />
          {siteMeta.name}
        </Link>

        <nav className="nav-links">
          <Link href="/chat">聊天</Link>
          <Link href="/history">历史</Link>
          <Link href="/admin/alerts">后台导出</Link>
          {email ? (
            <>
              <span className="user-email">{email}</span>
              <button className="ghost-btn small-btn" onClick={handleLogout}>退出</button>
            </>
          ) : (
            <Link href="/auth" className="ghost-btn small-btn">登录</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
