'use client';

import { useMemo, useState, useEffect } from 'react';
import { adminContent } from '@/lib/content';
import { getBrowserSupabase } from '@/lib/supabase-browser';

export default function AdminAlertsPage() {
  const supabase = useMemo(() => getBrowserSupabase(), []);
  const [accessKey, setAccessKey] = useState('');
  const [days, setDays] = useState(7);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || '');
    });
  }, [supabase]);

  async function handleExport() {
    try {
      setMessage('');
      const res = await fetch(`/api/export?days=${days}`, {
        headers: {
          'x-admin-export-key': accessKey
        }
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || '导出失败');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `心理预警周报_${days}d.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Excel 已开始下载。');
    } catch (err) {
      setMessage(err.message || '导出失败');
    }
  }

  return (
    <main className="container page-shell">
      <section className="glass-card admin-card">
        <div className="section-head">
          <h1>{adminContent.title}</h1>
          <p>{adminContent.subtitle}</p>
        </div>

        <div className="admin-panel">
          <div className="field-grid">
            <div>
              <label>{adminContent.accessKeyLabel}</label>
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="输入 ADMIN_EXPORT_KEY"
              />
            </div>
            <div>
              <label>{adminContent.daysLabel}</label>
              <input
                type="number"
                value={days}
                min={1}
                max={365}
                onChange={(e) => setDays(Number(e.target.value))}
              />
            </div>
          </div>

          <button className="primary-btn" onClick={handleExport}>
            {adminContent.exportButton}
          </button>

          <p className="helper-text">{adminContent.helper}</p>
          {email ? <p className="mini-text">当前登录账号：{email}</p> : null}
          {message ? <p className="info-text">{message}</p> : null}
        </div>
      </section>
    </main>
  );
}
