'use client';

import { useState } from 'react';
import { useMultiSigContext } from '@/contexts/MultiSigContext';
import { useSubmitTransaction } from '@/hooks/useMultiSig';
import { parseEther, isAddress, encodeFunctionData } from 'viem';

type TransactionType = 'eth' | 'contract';

export function SubmitTransaction() {
  const { walletAddress, isOwner, refreshWallet } = useMultiSigContext();
  const { submitTransaction, isPending, isConfirming, isSuccess, error } = useSubmitTransaction(walletAddress);

  const [txType, setTxType] = useState<TransactionType>('eth');
  const [destination, setDestination] = useState('');
  const [value, setValue] = useState('');
  const [data, setData] = useState('0x');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!destination || !isAddress(destination)) {
      setFormError('Invalid destination address');
      return;
    }

    if (txType === 'eth' && (!value || isNaN(parseFloat(value)))) {
      setFormError('Invalid ETH amount');
      return;
    }

    try {
      const txValue = txType === 'eth' ? parseEther(value || '0') : BigInt(0);
      const txData = (data || '0x') as `0x${string}`;

      submitTransaction(destination as `0x${string}`, txValue, txData);
    } catch (err) {
      setFormError('Failed to submit transaction');
    }
  };

  if (!walletAddress) {
    return (
      <div className="card text-center py-8">
        <p className="text-white/60">Select a wallet first</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="card text-center py-8">
        <p className="text-white/60">Only wallet owners can submit transactions</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-lg font-semibold text-white">Submit New Transaction</h3>

      {/* Transaction Type Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTxType('eth')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            txType === 'eth'
              ? 'bg-farcaster-purple text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          Send ETH
        </button>
        <button
          type="button"
          onClick={() => setTxType('contract')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            txType === 'contract'
              ? 'bg-farcaster-purple text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          Contract Call
        </button>
      </div>

      {/* Destination */}
      <div>
        <label className="block text-white/60 text-sm mb-2">
          Destination Address
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="0x..."
          className="input font-mono text-sm"
        />
      </div>

      {/* ETH Value */}
      {txType === 'eth' && (
        <div>
          <label className="block text-white/60 text-sm mb-2">
            Amount (ETH)
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0.0"
            className="input"
          />
        </div>
      )}

      {/* Contract Data */}
      {txType === 'contract' && (
        <div>
          <label className="block text-white/60 text-sm mb-2">
            Transaction Data (hex)
          </label>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="0x..."
            rows={3}
            className="input font-mono text-sm resize-none"
          />
          <p className="text-white/40 text-xs mt-1">
            Enter the encoded function call data
          </p>
        </div>
      )}

      {/* Errors */}
      {(formError || error) && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
          <p className="text-red-400 text-sm">
            {formError || error?.message || 'Transaction failed'}
          </p>
        </div>
      )}

      {/* Success */}
      {isSuccess && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
          <p className="text-green-400 text-sm">
            Transaction submitted successfully!
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending
          ? 'Confirm in Wallet...'
          : isConfirming
          ? 'Submitting...'
          : 'Submit Transaction'}
      </button>
    </form>
  );
}
