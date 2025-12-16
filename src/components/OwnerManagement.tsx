'use client';

import { useState } from 'react';
import { useMultiSigContext } from '@/contexts/MultiSigContext';
import { useSubmitTransaction } from '@/hooks/useMultiSig';
import { encodeFunctionData, isAddress } from 'viem';
import { multiSigWalletABI } from '@/lib/abi';

type ActionType = 'add' | 'remove' | 'replace' | 'requirement';

export function OwnerManagement() {
  const { walletAddress, owners, required, isOwner } = useMultiSigContext();
  const { submitTransaction, isPending, isConfirming, isSuccess, error } = useSubmitTransaction(walletAddress);

  const [action, setAction] = useState<ActionType>('add');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!walletAddress) {
      setFormError('No wallet selected');
      return;
    }

    try {
      let data: `0x${string}`;

      switch (action) {
        case 'add':
          if (!isAddress(ownerAddress)) {
            setFormError('Invalid owner address');
            return;
          }
          data = encodeFunctionData({
            abi: multiSigWalletABI,
            functionName: 'addOwner',
            args: [ownerAddress as `0x${string}`],
          });
          break;

        case 'remove':
          if (!isAddress(ownerAddress)) {
            setFormError('Invalid owner address');
            return;
          }
          data = encodeFunctionData({
            abi: multiSigWalletABI,
            functionName: 'removeOwner',
            args: [ownerAddress as `0x${string}`],
          });
          break;

        case 'replace':
          if (!isAddress(ownerAddress) || !isAddress(newOwnerAddress)) {
            setFormError('Invalid address');
            return;
          }
          data = encodeFunctionData({
            abi: multiSigWalletABI,
            functionName: 'replaceOwner',
            args: [ownerAddress as `0x${string}`, newOwnerAddress as `0x${string}`],
          });
          break;

        case 'requirement':
          const req = parseInt(newRequirement);
          if (isNaN(req) || req < 1 || req > (owners?.length || 0)) {
            setFormError(`Requirement must be between 1 and ${owners?.length || 0}`);
            return;
          }
          data = encodeFunctionData({
            abi: multiSigWalletABI,
            functionName: 'changeRequirement',
            args: [BigInt(req)],
          });
          break;

        default:
          return;
      }

      // Submit as a transaction to self (wallet calls itself)
      submitTransaction(walletAddress, BigInt(0), data);
    } catch (err) {
      setFormError('Failed to encode transaction');
    }
  };

  if (!walletAddress) {
    return (
      <div className="card text-center py-8">
        <p className="text-white/60">Select a wallet first</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Owners */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-3">Current Owners</h3>
        <div className="space-y-2">
          {owners?.map((owner, index) => (
            <div
              key={owner}
              className="flex items-center justify-between bg-white/5 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-sm">#{index + 1}</span>
                <span className="font-mono text-sm text-white break-all">
                  {owner}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-white/40 text-sm mt-3">
          Required confirmations: {required} of {owners?.length}
        </p>
      </div>

      {/* Management Actions */}
      {isOwner && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h3 className="text-lg font-semibold text-white">Manage Owners</h3>

          {/* Action Type Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAction('add')}
              className={`py-2 rounded-lg text-sm transition-colors ${
                action === 'add'
                  ? 'bg-farcaster-purple text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              Add Owner
            </button>
            <button
              type="button"
              onClick={() => setAction('remove')}
              className={`py-2 rounded-lg text-sm transition-colors ${
                action === 'remove'
                  ? 'bg-farcaster-purple text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              Remove Owner
            </button>
            <button
              type="button"
              onClick={() => setAction('replace')}
              className={`py-2 rounded-lg text-sm transition-colors ${
                action === 'replace'
                  ? 'bg-farcaster-purple text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              Replace Owner
            </button>
            <button
              type="button"
              onClick={() => setAction('requirement')}
              className={`py-2 rounded-lg text-sm transition-colors ${
                action === 'requirement'
                  ? 'bg-farcaster-purple text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              Change Required
            </button>
          </div>

          {/* Dynamic Fields */}
          {(action === 'add' || action === 'remove' || action === 'replace') && (
            <div>
              <label className="block text-white/60 text-sm mb-2">
                {action === 'add' ? 'New Owner Address' : 'Owner Address'}
              </label>
              <input
                type="text"
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
                placeholder="0x..."
                className="input font-mono text-sm"
              />
            </div>
          )}

          {action === 'replace' && (
            <div>
              <label className="block text-white/60 text-sm mb-2">
                Replacement Owner Address
              </label>
              <input
                type="text"
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
                placeholder="0x..."
                className="input font-mono text-sm"
              />
            </div>
          )}

          {action === 'requirement' && (
            <div>
              <label className="block text-white/60 text-sm mb-2">
                New Required Confirmations (1-{owners?.length || 0})
              </label>
              <input
                type="number"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                min={1}
                max={owners?.length || 1}
                className="input"
              />
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
                Transaction submitted! Other owners need to confirm.
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || isConfirming}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isPending
              ? 'Confirm in Wallet...'
              : isConfirming
              ? 'Submitting...'
              : 'Submit Change'}
          </button>

          <p className="text-white/40 text-xs text-center">
            Owner changes require multi-sig approval
          </p>
        </form>
      )}
    </div>
  );
}
