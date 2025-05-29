
// This file is deprecated and will be deleted.
// Content has been moved to src/app/[locale]/login/page.tsx
export default function DeprecatedLoginPage() {
   if (typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/');
    const localeSegment = segments[1];
    const validLocales = ['en', 'ru', 'uz'];
    const locale = validLocales.includes(localeSegment) ? localeSegment : 'uz';
    // Preserve query params like callbackUrl
    window.location.href = `/${locale}/login${window.location.search}`;
  }
  return null;
}
