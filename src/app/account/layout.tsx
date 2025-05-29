
// This file is deprecated and will be deleted.
// Content has been moved to src/app/[locale]/account/layout.tsx
export default function DeprecatedAccountLayout({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/');
    const localeSegment = segments[1];
    const validLocales = ['en', 'ru', 'uz'];
    const locale = validLocales.includes(localeSegment) ? localeSegment : 'uz';
    const accountSubPath = segments.slice(2).join('/'); // e.g., profile, orders
    window.location.href = `/${locale}/account${accountSubPath ? '/' + accountSubPath : ''}${window.location.search}`;
  }
  return <>{children}</>; // Render children to avoid errors during transition if any
}
