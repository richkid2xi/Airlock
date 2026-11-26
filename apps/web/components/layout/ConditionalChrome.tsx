'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

const APP_ROUTES = ['/app', '/connect', '/onboarding'];

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute =
    pathname === '/app' ||
    pathname.startsWith('/app/') ||
    pathname === '/connect' ||
    pathname === '/onboarding';
  const showChrome = !isAppRoute;

  if (!showChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
