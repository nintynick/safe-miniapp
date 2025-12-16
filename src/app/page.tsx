'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@/components/ConnectWallet';
import { WalletSelector } from '@/components/WalletSelector';
import { WalletDashboard } from '@/components/WalletDashboard';
import { SubmitTransaction } from '@/components/SubmitTransaction';
import { TransactionList } from '@/components/TransactionList';
import { OwnerManagement } from '@/components/OwnerManagement';
import { useMultiSigContext } from '@/contexts/MultiSigContext';

type Tab = 'dashboard' | 'transactions' | 'submit' | 'owners';

export default function Home() {
  const { isConnected } = useAccount();
  const { walletAddress } = useMultiSigContext();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Safe MultiSig</h1>
          <p className="text-white/60 text-sm">Secure multi-signature wallet</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-farcaster-purple/20 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-farcaster-purple"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>

      {/* Wallet Connection */}
      {!isConnected ? (
        <div className="card py-8">
          <h2 className="text-lg font-semibold text-white text-center mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-white/60 text-sm text-center mb-6">
            Connect with your Farcaster wallet to access the MultiSig
          </p>
          <ConnectWallet />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex justify-end">
            <ConnectWallet />
          </div>

          {/* Wallet Selector */}
          <WalletSelector />

          {/* Navigation Tabs */}
          {walletAddress && (
            <>
              <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 py-2 rounded-md text-sm transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-farcaster-purple text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`flex-1 py-2 rounded-md text-sm transition-colors ${
                    activeTab === 'transactions'
                      ? 'bg-farcaster-purple text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => setActiveTab('submit')}
                  className={`flex-1 py-2 rounded-md text-sm transition-colors ${
                    activeTab === 'submit'
                      ? 'bg-farcaster-purple text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  New
                </button>
                <button
                  onClick={() => setActiveTab('owners')}
                  className={`flex-1 py-2 rounded-md text-sm transition-colors ${
                    activeTab === 'owners'
                      ? 'bg-farcaster-purple text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Owners
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {activeTab === 'dashboard' && <WalletDashboard />}
                {activeTab === 'transactions' && <TransactionList />}
                {activeTab === 'submit' && <SubmitTransaction />}
                {activeTab === 'owners' && <OwnerManagement />}
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-white/30 text-xs">
          Powered by Farcaster
        </p>
      </div>
    </main>
  );
}
