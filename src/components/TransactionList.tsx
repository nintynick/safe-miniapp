'use client';

import { useState, useEffect } from 'react';
import { useMultiSigContext } from '@/contexts/MultiSigContext';
import { useReadContract } from 'wagmi';
import { multiSigWalletABI } from '@/lib/abi';
import { TransactionItem } from './TransactionItem';

type FilterType = 'all' | 'pending' | 'executed';

export function TransactionList() {
  const { walletAddress, transactionCount } = useMultiSigContext();
  const [filter, setFilter] = useState<FilterType>('pending');
  const [transactionIds, setTransactionIds] = useState<bigint[]>([]);

  // Get pending transaction count
  const { data: pendingCount } = useReadContract({
    address: walletAddress,
    abi: multiSigWalletABI,
    functionName: 'getTransactionCount',
    args: [true, false], // pending: true, executed: false
  });

  // Get executed transaction count
  const { data: executedCount } = useReadContract({
    address: walletAddress,
    abi: multiSigWalletABI,
    functionName: 'getTransactionCount',
    args: [false, true], // pending: false, executed: true
  });

  // Generate transaction IDs to display (most recent first)
  useEffect(() => {
    if (transactionCount > 0) {
      const ids: bigint[] = [];
      const start = Math.max(0, transactionCount - 20); // Show last 20 transactions
      for (let i = transactionCount - 1; i >= start; i--) {
        ids.push(BigInt(i));
      }
      setTransactionIds(ids);
    } else {
      setTransactionIds([]);
    }
  }, [transactionCount]);

  if (!walletAddress) {
    return (
      <div className="card text-center py-8">
        <p className="text-white/60">Select a wallet to view transactions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'pending'
              ? 'bg-farcaster-purple text-white'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          Pending ({pendingCount?.toString() || 0})
        </button>
        <button
          onClick={() => setFilter('executed')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'executed'
              ? 'bg-farcaster-purple text-white'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          Executed ({executedCount?.toString() || 0})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'all'
              ? 'bg-farcaster-purple text-white'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          All ({transactionCount})
        </button>
      </div>

      {/* Transaction Items */}
      <div className="space-y-3">
        {transactionIds.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-white/60">No transactions yet</p>
          </div>
        ) : (
          transactionIds.map((id) => (
            <TransactionItem
              key={id.toString()}
              transactionId={id}
              filter={filter}
            />
          ))
        )}
      </div>
    </div>
  );
}
