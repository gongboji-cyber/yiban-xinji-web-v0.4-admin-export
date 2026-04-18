'use client';

import { useEffect, useMemo, useState } from 'react';
import { chatContent } from '@/lib/content';
import { getBrowserSupabase } from '@/lib/supabase-browser';

export default function ChatWorkspace({ schoolAppointmentUrl }) {
  const supabase = useMemo(() => getBrowserSupabase(), []);
  const [user, setUser] = useState(null);
  const [conversationId, setConversationId] = useState('');
  const [input, setInput] = useState('');
  const [consentSchoolShare, setConsentSchoolShare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user || null);
    });
    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function ensureConversation(currentUser) {
    if (conversationId) return conversationId;
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: currentUser.id,
        title: '新的对话'
      })
      .select('id')
      .single();

    if (error) throw error;
    setConversationId(data.id);
    return data.id;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!user) {
      setError('请先登录后再开始聊天。');
      return;
    }
    if (!input.trim()) {
      setError('先写点东西，再让系统分析。');
      return;
    }

    try {
      setLoading(true);
      const cid = await ensureConversation(user);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          input,
          conversationId: cid,
          consentSchoolShare
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '生成失败');
      setResult(json);
      setInput('');
    } catch (err) {
      setError(err.message || '出错了');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="workspace-grid">
      <section className="glass-card workspace-main">
        <div className="section-head">
          <h2>{chatContent.title}</h2>
          <p>{chatContent.subtitle}</p>
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <label htmlFor="user-input">{chatContent.textareaLabel}</label>
          <textarea
            id="user-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={chatContent.textareaPlaceholder}
            rows={8}
          />
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={consentSchoolShare}
              onChange={(e) => setConsentSchoolShare(e.target.checked)}
            />
            <span>{chatContent.consentLabel}</span>
          </label>
          <button className="primary-btn" disabled={loading}>
            {loading ? chatContent.working : chatContent.sendButton}
          </button>
        </form>

        {error ? <p className="error-text">{error}</p> : null}
      </section>

      <section className="glass-card workspace-side">
        <div className="section-head">
          <h3>当前结果</h3>
          <p>发送后会在这里显示结构化输出。</p>
        </div>

        {result ? (
          <div className="cards-stack">
            <InfoCard title={chatContent.cards.reply} content={result.reply} />
            <InfoCard title={chatContent.cards.insight} content={result.insight} />
            <InfoCard title={chatContent.cards.journal} content={result.journal_draft} />
            <InfoCard
              title={chatContent.cards.abc}
              content={
                <>
                  <p><strong>A：</strong>{result.abc?.activating_event || '—'}</p>
                  <p><strong>B：</strong>{result.abc?.belief || '—'}</p>
                  <p><strong>C：</strong>{result.abc?.consequence || '—'}</p>
                </>
              }
            />
            <InfoCard
              title={chatContent.cards.followup}
              content={
                <ul className="bullet-list">
                  {(result.follow_up || []).map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              }
            />
            <div className={`info-card risk-card risk-${result.risk_level || 'low'}`}>
              <h4>{chatContent.cards.risk}</h4>
              <p><strong>等级：</strong>{String(result.risk_level || 'low').toUpperCase()}</p>
              <p><strong>原因：</strong>{result.risk_reason || '—'}</p>
              {result.risk_level === 'high' ? (
                <div className="risk-actions">
                  <a className="primary-btn" href={schoolAppointmentUrl} target="_blank">
                    {chatContent.appointmentButton}
                  </a>
                  <p className="mini-text">{chatContent.appointmentHint}</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="empty-hint">还没有结果。先在左侧输入内容。</p>
        )}
      </section>
    </div>
  );
}

function InfoCard({ title, content }) {
  return (
    <div className="info-card">
      <h4>{title}</h4>
      <div className="card-content">{content}</div>
    </div>
  );
}
