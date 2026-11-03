export default function BrandWordmark() {
  return <span className="brand-wordmark" aria-hidden="true">
    <span className="brand-wordmark__sizer">Aditya Anugrah</span>
    <span className="brand-wordmark__sequence">
      <span className="brand-wordmark__word"><span>A</span><span className="brand-wordmark__tail brand-wordmark__tail--first">ditya</span></span>{' '}
      <span className="brand-wordmark__word brand-wordmark__word--second"><span>A</span><span className="brand-wordmark__tail brand-wordmark__tail--second">nugrah</span></span>
    </span>
  </span>;
}
