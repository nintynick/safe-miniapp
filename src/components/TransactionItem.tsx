'use client';

import { useMultiSigContext } from '@/contexts/MultiSigContext';
import { useTransaction, useConfirmTransaction, useRevokeConfirmation, useExecuteTransaction } from '@/hooks/useMultiSig';
import { formatEther } from 'viem';

interface TransactionItemProps {
  transactionId: bigint;
  filter: 'all' | 'pending' | 'executed';
}

export function TransactionItem({ transactionId, filter }: TransactionItemProps) {
  const { walletAddress, required, isOwner, userAddress } = useMultiSigContext();
  const transaction = useTransaction(walletAddress, transactionId);

  const { confirmTransaction, isPending: isConfirmPending } = useConfirmTransaction(walletAddress);
  const { revokeConfirmation, isPending: isRevokePending } = useRevokeConfirmation(walletAddress);
  const { executeTransaction, isPending: isExecutePending } = useExecuteTransaction(walletAddress);

  if (!transaction) {
    return null;
  }

  // Apply filter
  if (filter === 'pending' && transaction.executed) return null;
  if (filter === 'executed' && !transaction.executed) return null;

  const hasConfirmed = userAddress && transaction.confirmations.includes(userAddress);
  const canExecute = transaction.isConfirmed && !transaction.executed;
  const confirmationsNeeded = (required || 0) - transaction.confirmationCount;

  return (
    <div className="card">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-white/60 text-sm">Transaction #{transactionId.toString()}</span>
          {transaction.executed ? (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">
              Executed
            </span>
          ) : canExecute ? (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">
              Ready to Execute
            </span>
          ) : (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
              Pending ({confirmationsNeeded} more needed)
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-farcaster-purple font-semibold">
            {formatEther(transaction.value)} ETH
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-3">
        <div>
          <span className="text-white/40 text-xs">To:</span>
          <p className="font-mono text-sm text-white/80 break-all">
            {transaction.destination}
          </p>
        </div>

        {transaction.data !== '0x' && (
          <div>
            <span className="text-white/40 text-xs">Data:</span>
            <p className="font-mono text-xs text-white/60 break-all bg-white/5 rounded p-2 mt-1">
              {transaction.data.length > 66
                ? `${transaction.data.slice(0, 66)}...`
                : transaction.data}
            </p>
          </div>
        )}
      </div>

      {/* Confirmations */}
      <div className="mb-3">
        <span className="text-white/40 text-xs">
          Confirmations ({transaction.confirmationCount}/{required || 0}):
        </span>
        <div className="flex flex-wrap gap-1 mt-1">
          {transaction.confirmations.map((addr) => (
            <span
              key={addr}
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono ${
                addr === userAddress
                  ? 'bg-farcaster-purple/30 text-farcaster-purple'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              {addr.slice(0, 6)}...{addr.slice(-4)}
              {addr === userAddress && ' (you)'}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      {isOwner && !transaction.executed && (
        <div className="flex gap-2 pt-3 border-t border-white/10">
          {!hasConfirmed ? (
            <button
              onClick={() => confirmTransaction(transactionId)}
              disabled={isConfirmPending}
              className="btn-primary text-sm flex-1 disabled:opacity-50"
            >
              {isConfirmPending ? 'Confirming...' : 'Confirm'}
            </button>
          ) : (
            <button
              onClick={() => revokeConfirmation(transactionId)}
              disabled={isRevokePending}
              className="btn-secondary text-sm flex-1 disabled:opacity-50"
            >
              {isRevokePending ? 'Revoking...' : 'Revoke'}
            </button>
          )}

          {canExecute && (
            <button
              onClick={() => executeTransaction(transactionId)}
              disabled={isExecutePending}
              className="btn-primary text-sm flex-1 disabled:opacity-50"
            >
              {isExecutePending ? 'Executing...' : 'Execute'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
