import { Link } from 'react-router-dom';

export function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Section({ title, children, className = '' }) {
  return (
    <section className={`py-14 sm:py-20 ${className}`}>
      <Container>
        {title && <h2 className='mb-8 text-2xl font-semibold tracking-tight sm:text-3xl'>{title}</h2>}
        {children}
      </Container>
    </section>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <header className='hero-glow border-b border-border'>
      <Container className='py-14 sm:py-20'>
        <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>{title}</h1>
        {subtitle && <p className='mt-4 max-w-2xl text-lg text-muted'>{subtitle}</p>}
        {children}
      </Container>
    </header>
  );
}

export function Card({ title, children }) {
  return (
    <div className='rounded-xl border border-border bg-surface p-5 transition-colors hover:border-brand/60'>
      <h3 className='font-semibold'>{title}</h3>
      {children && <p className='mt-2 text-sm text-muted'>{children}</p>}
    </div>
  );
}

export function CardGrid({ children }) {
  return <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>{children}</div>;
}

export function EmptyState({ children }) {
  return <p className='rounded-xl border border-dashed border-border p-8 text-center text-muted'>{children}</p>;
}

export const Arrow = () => (
  <span aria-hidden='true' className='inline-block rtl:rotate-180'>
    &rarr;
  </span>
);

export function ButtonLink({ to, variant = 'primary', children }) {
  const styles = variant === 'primary' ? 'bg-brand text-white hover:bg-brand/90' : 'border border-border text-fg hover:border-accent';
  return (
    <Link to={to} className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-medium transition-colors ${styles}`}>
      {children}
    </Link>
  );
}

export const textLinkClass = 'mt-6 inline-flex items-center gap-2 text-accent hover:underline';
