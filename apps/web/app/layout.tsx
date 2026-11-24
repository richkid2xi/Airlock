import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Airlock',
  description: 'Firewall for AI-agent Solana wallets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
