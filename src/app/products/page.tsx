
// This file is deprecated and will be deleted.
// Content has been moved to src/app/[locale]/products/page.tsx
// Please ensure all links point to the new localized path.
export default function DeprecatedProductsPage() {
  if (typeof window !== 'undefined') {
    // Attempt to get locale from path or default
    const segments = window.location.pathname.split('/');
    const localeSegment = segments[1];
    const validLocales = ['en', 'ru', 'uz']; // From i18n-config
    const locale = validLocales.includes(localeSegment) ? localeSegment : 'uz'; // Default to 'uz'
    window.location.href = `/${locale}/products${window.location.search}`;
  }
  return null; 
}
