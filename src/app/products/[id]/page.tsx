
// This file is deprecated and will be deleted.
// Content has been moved to src/app/[locale]/products/[id]/page.tsx
// Please ensure all links point to the new localized path.
export default function DeprecatedProductDetailPage({ params }: { params: { id: string }}) {
   if (typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/');
    const localeSegment = segments[1];
    const validLocales = ['en', 'ru', 'uz'];
    const locale = validLocales.includes(localeSegment) ? localeSegment : 'uz';
    window.location.href = `/${locale}/products/${params.id}`;
  }
  return null;
}
