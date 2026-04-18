import Link from 'next/link';

export default function HeroActions({ primaryHref, secondaryHref, primaryText, secondaryText }) {
  return (
    <div className="hero-actions">
      <Link href={primaryHref} className="primary-btn">{primaryText}</Link>
      <Link href={secondaryHref} className="ghost-btn">{secondaryText}</Link>
    </div>
  );
}
