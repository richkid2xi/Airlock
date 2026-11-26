'use client';

import { type ReactNode } from "react";
import { WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <SolanaWalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect>
      {children}
    </SolanaWalletProvider>
  );
}