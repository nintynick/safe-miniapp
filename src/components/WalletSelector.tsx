'use client';

import { useState } from 'react';
import { useMultiSigContext } from '@/contexts/MultiSigContext';
import { isAddress } from 'viem';

interface WalletSelectorProps {
  onDeployClick?: () => void;
}

export function WalletSelector({ onDeployClick }: WalletSelectorProps) {
  const { walletAddress, setWalletAddress } = useMultiSigContext();
  const [inputAddress, setInputAddress] = useState(walletAddress || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!inputAddress) {
      setError('Please enter a wallet address');
      return;
    }

    if (!isAddress(inputAddress)) {
      setError('Invalid Ethereum address');
      return;
    }

    setWalletAddress(inputAddress as `0x${string}`);
  };

  return (
    <div className="card">
      <label className="block text-white/60 text-sm mb-2">
        MultiSig Wallet Address
      </label>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="0x..."
            className="input flex-1 font-mono text-sm"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Load Wallet
          </button>
        </div>
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
        {walletAddress && walletAddress !== inputAddress && (
          <p className="text-white/40 text-sm mt-2">
            Currently viewing: {walletAddress.slice(0, 10)}...
          </p>
        )}
      </form>

      {onDeployClick && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onDeployClick}
            className="btn-secondary w-full text-sm"
          >
            Deploy New Safe
          </button>
        </div>
      )}
    </div>
  );
}
