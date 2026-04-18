import Link from 'next/link';
import HeroActions from '@/components/HeroActions';
import { homeContent } from '@/lib/content';

export default function HomePage() {
  return (
    <main className="container page-shell">
      <section className="hero-grid">
        <div className="glass-card hero-main">
          <div className="tag">{homeContent.badge}</div>
          <h1>{homeContent.title}</h1>
          <p className="hero-subtitle">{homeContent.subtitle}</p>
          <HeroActions
            primaryHref="/chat"
            secondaryHref="/admin/alerts"
            primaryText={homeContent.primaryButton}
            secondaryText={homeContent.secondaryButton}
          />
          <div className="stats-grid">
            {homeContent.featureCards.map((item) => (
              <div key={item.no} className="stat-card">
                <span className="stat-no">{item.no}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card hero-side">
          <div className="section-head">
            <h2>{homeContent.flowTitle}</h2>
          </div>
          <ol className="flow-list">
            {homeContent.flowItems.map((item, idx) => (
              <li key={idx}>
                <span className="flow-index">{String(idx + 1).padStart(2, '0')}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <div className="reality-check">
            <h3>Reality Check</h3>
            <p>把可落地的登录、聊天、留痕、导出跑通。</p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>{homeContent.noticeTitle}</h2>
        </div>
        <div className="notes-grid">
          <div className="glass-card notes-card">
            <h3>{homeContent.zhCardTitle}</h3>
            <ol>
              {homeContent.zhNotes.map((item, idx) => <li key={idx}>{item}</li>)}
            </ol>
          </div>
          <div className="glass-card notes-card">
            <h3>{homeContent.enCardTitle}</h3>
            <ol>
              {homeContent.enNotes.map((item, idx) => <li key={idx}>{item}</li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className="section-block compact-links">
        <div className="glass-card inline-links">
          <Link href="/auth" className="ghost-btn">先注册登录</Link>
          <Link href="/history" className="ghost-btn">查看历史记录</Link>
          <Link href="/admin/alerts" className="ghost-btn">导出后台 Excel</Link>
        </div>
      </section>
    </main>
  );
}
