'use client';

import { useEffect, useMemo, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import { historyContent } from '@/lib/content';

export default function HistoryPage() {
  const supabase = useMemo(() => getBrowserSupabase(), []);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          setError('请先登录再查看历史记录。');
          return;
        }
        const { data, error } = await supabase
          .from('messages')
          .select('id, content, insight, risk_level, created_at')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false })
          .limit(30);

        if (error) throw error;
        if (alive) setRows(data || []);
      } catch (err) {
        if (alive) setError(err.message || '加载失败');
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [supabase]);

  return (
    <main className="container page-shell">
      <section className="glass-card">
        <div className="section-head">
          <h1>{historyContent.title}</h1>
          <p>{historyContent.subtitle}</p>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        {!error && rows.length === 0 ? (
          <p className="empty-hint">{historyContent.empty}</p>
        ) : (
          <div className="history-list">
            {rows.map((item) => (
              <article className="history-item" key={item.id}>
                <div className="history-meta">
                  <span>{new Date(item.created_at).toLocaleString()}</span>
                  <span className={`pill pill-${item.risk_level || 'low'}`}>{item.risk_level || 'low'}</span>
                </div>
                <p><strong>原始输入：</strong>{item.content}</p>
                <p><strong>洞察摘要：</strong>{item.insight || '—'}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
