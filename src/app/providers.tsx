'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi';
import { MultiSigProvider } from '@/contexts/MultiSigContext';
import { useState, useEffect, type ReactNode } from 'react';
import { initializeFarcasterSDK } from '@/lib/farcaster';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeFarcasterSDK().then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farcaster-purple mx-auto mb-4"></div>
          <p className="text-white/60">Loading Safe MultiSig...</p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MultiSigProvider>
          {children}
        </MultiSigProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
