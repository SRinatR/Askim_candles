
import { NextResponse, type NextRequest } from 'next/server';
import { i18n } from './lib/i1n-config';

// This middleware is currently not used for redirection to default locale,
// as root page.tsx handles it.
// It can be expanded for more complex locale detection (e.g., from headers).

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is for an API route or static file, if so, ignore
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin/') || // Assuming admin panel is not localized
    pathname.startsWith('/_next/') ||
    pathname.includes('.') // Typically files like .png, .ico
  ) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // If the pathname is missing a locale, redirect to the default locale
  // This part is currently handled by the root page.tsx redirect for simplicity.
  // If you want middleware-based redirection, uncomment and adjust.
  /*
  if (pathnameIsMissingLocale) {
    const url = new URL(
      `/${i18n.defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
      request.url
    );
    return NextResponse.redirect(url);
  }
  */

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/` and static files
  matcher: ['/((?!api|_next/static|_next/image|admin|favicon.ico|images).*)'],
};
