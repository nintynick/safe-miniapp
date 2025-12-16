'use client';

import { useMultiSigContext } from '@/contexts/MultiSigContext';
import { formatEther } from 'viem';

export function WalletDashboard() {
  const {
    walletAddress,
    balance,
    owners,
    required,
    transactionCount,
    isOwner,
    userAddress,
  } = useMultiSigContext();

  if (!walletAddress) {
    return (
      <div className="card text-center py-8">
        <p className="text-white/60">No wallet selected</p>
        <p className="text-white/40 text-sm mt-2">
          Enter a wallet address or create a new one
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Balance Card */}
      <div className="card">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/60 text-sm">Wallet Balance</p>
            <p className="text-3xl font-bold text-white mt-1">
              {balance ? formatEther(balance) : '0'} ETH
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-sm">Required Signatures</p>
            <p className="text-xl font-semibold text-white mt-1">
              {required || 0} of {owners?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Address Card */}
      <div className="card">
        <p className="text-white/60 text-sm mb-2">Wallet Address</p>
        <p className="font-mono text-sm text-white break-all bg-white/5 rounded-lg p-3">
          {walletAddress}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <p className="text-white/60 text-sm">Total Transactions</p>
          <p className="text-2xl font-bold text-white mt-1">{transactionCount}</p>
        </div>
        <div className="card">
          <p className="text-white/60 text-sm">Your Status</p>
          <div className="mt-1">
            {isOwner ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Owner
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-400">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Viewer
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Connected Address */}
      {userAddress && (
        <div className="card">
          <p className="text-white/60 text-sm mb-2">Your Address</p>
          <p className="font-mono text-sm text-white/80 break-all">
            {userAddress}
          </p>
        </div>
      )}
    </div>
  );
}
