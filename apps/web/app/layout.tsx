import type { Metadata } from 'next';
import { Roboto_Flex } from 'next/font/google';
import { Roboto_Mono } from 'next/font/google';
import './globals.css';
import { ConditionalChrome } from '@/components/layout/ConditionalChrome';

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-roboto',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'Airlock | Firewall for AI-Agent Solana Wallets',
  description: 'Pre-flight transaction simulation, policy guardrails, and autonomous threat interception for Solana AI agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${robotoFlex.variable} ${robotoMono.variable} min-h-screen antialiased`}>
        <ConditionalChrome>{children}</ConditionalChrome>
      </body>
    </html>
  );
}
