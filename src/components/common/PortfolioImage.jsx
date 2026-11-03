import { useState } from 'react';
import { portfolioMedia } from '../../lib/portfolioMedia';
import { useActiveLocale } from '../../lib/i18n';

export default function PortfolioImage({ src, alt = '', className = '', ...props }) {
  const source = portfolioMedia(src);
  const [broken, setBroken] = useState(null);
  const id = useActiveLocale() === 'id';
  if (!source || broken === source) return <div className={`image-unavailable ${className}`} role="img" aria-label={`${alt}. ${id?'Preview belum tersedia':'Preview unavailable'}`}><span className="image-monogram" aria-hidden="true">/</span><strong>{alt.replace(/\s*—\s*/g,' / ') || (id?'Gambar project':'Project image')}</strong><span>{id?'Preview belum tersedia':'Preview unavailable'}</span></div>;
  return <img {...props} src={source} alt={alt} className={className} onError={() => setBroken(source)}/>;
}
