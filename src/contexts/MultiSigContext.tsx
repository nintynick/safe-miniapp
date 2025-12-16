'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useMultiSigWallet } from '@/hooks/useMultiSig';

interface MultiSigContextType {
  walletAddress: `0x${string}` | undefined;
  setWalletAddress: (address: `0x${string}` | undefined) => void;
  balance: bigint | undefined;
  owners: `0x${string}`[] | undefined;
  required: number | undefined;
  transactionCount: number;
  isOwner: boolean;
  userAddress: `0x${string}` | undefined;
  refreshWallet: () => void;
}

const MultiSigContext = createContext<MultiSigContextType | undefined>(undefined);

export function MultiSigProvider({
  children,
  defaultWalletAddress
}: {
  children: ReactNode;
  defaultWalletAddress?: `0x${string}`;
}) {
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | undefined>(defaultWalletAddress);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    balance,
    owners,
    required,
    transactionCount,
    isOwner,
    userAddress,
  } = useMultiSigWallet(walletAddress);

  const refreshWallet = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return (
    <MultiSigContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        balance,
        owners,
        required,
        transactionCount,
        isOwner,
        userAddress,
        refreshWallet,
      }}
    >
      {children}
    </MultiSigContext.Provider>
  );
}

export function useMultiSigContext() {
  const context = useContext(MultiSigContext);
  if (context === undefined) {
    throw new Error('useMultiSigContext must be used within a MultiSigProvider');
  }
  return context;
}
