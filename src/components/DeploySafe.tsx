'use client';

import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { isAddress, type WalletClient } from 'viem';
import { ethers } from 'ethers';
import MultiSigWalletArtifact from '../../artifacts/src/contracts/MultiSigWallet.sol/MultiSigWallet.json';

interface DeploySafeProps {
  onBack?: () => void;
}

export function DeploySafe({ onBack }: DeploySafeProps) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [owners, setOwners] = useState<string[]>([address || '']);
  const [requiredConfirmations, setRequiredConfirmations] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string>('');
  const [error, setError] = useState('');

  const addOwner = () => {
    setOwners([...owners, '']);
  };

  const removeOwner = (index: number) => {
    setOwners(owners.filter((_, i) => i !== index));
  };

  const updateOwner = (index: number, value: string) => {
    const newOwners = [...owners];
    newOwners[index] = value;
    setOwners(newOwners);
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDeployedAddress('');

    // Validation
    const validOwners = owners.filter(o => o.trim() !== '');
    if (validOwners.length === 0) {
      setError('At least one owner is required');
      return;
    }

    for (const owner of validOwners) {
      if (!isAddress(owner)) {
        setError(`Invalid address: ${owner}`);
        return;
      }
    }

    if (requiredConfirmations < 1 || requiredConfirmations > validOwners.length) {
      setError(`Required confirmations must be between 1 and ${validOwners.length}`);
      return;
    }

    if (!walletClient) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsDeploying(true);

      // Create ethers provider from viem walletClient
      const provider = new ethers.BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();

      console.log('Deploying MultiSigWallet with the account:', await signer.getAddress());
      console.log('Owners:', validOwners);
      console.log('Required confirmations:', requiredConfirmations);

      // Deploy using ethers ContractFactory (same as deploy script)
      const MultiSigWallet = new ethers.ContractFactory(
        MultiSigWalletArtifact.abi,
        MultiSigWalletArtifact.bytecode,
        signer
      );

      const wallet = await MultiSigWallet.deploy(validOwners, requiredConfirmations);

      console.log('Deployment transaction sent, waiting for confirmation...');
      await wallet.waitForDeployment();

      const contractAddress = await wallet.getAddress();
      console.log('MultiSigWallet deployed to:', contractAddress);

      setDeployedAddress(contractAddress);
    } catch (err: any) {
      console.error('Deployment error:', err);
      setError(err.message || 'Failed to deploy Safe');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <h2 className="text-lg font-semibold text-white">
          Deploy New Safe on Base
        </h2>
      </div>

      {deployedAddress ? (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400 font-semibold mb-2">
              Safe Deployed Successfully!
            </p>
            <p className="text-white/60 text-sm mb-2">Contract Address:</p>
            <code className="block bg-black/20 p-2 rounded text-green-400 text-sm break-all">
              {deployedAddress}
            </code>
          </div>
          <button
            onClick={() => {
              setDeployedAddress('');
              setOwners([address || '']);
              setRequiredConfirmations(1);
            }}
            className="btn-secondary w-full"
          >
            Deploy Another Safe
          </button>
        </div>
      ) : (
        <form onSubmit={handleDeploy} className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Owners ({owners.length})
            </label>
            <div className="space-y-2">
              {owners.map((owner, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={owner}
                    onChange={(e) => updateOwner(index, e.target.value)}
                    placeholder="0x..."
                    className="input flex-1 font-mono text-sm"
                  />
                  {owners.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOwner(index)}
                      className="btn-secondary px-3"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOwner}
              className="btn-secondary w-full mt-2 text-sm"
            >
              + Add Owner
            </button>
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">
              Required Confirmations
            </label>
            <input
              type="number"
              min="1"
              max={owners.length}
              value={requiredConfirmations}
              onChange={(e) => setRequiredConfirmations(parseInt(e.target.value))}
              className="input w-full"
            />
            <p className="text-white/40 text-xs mt-1">
              Number of owners required to approve a transaction
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isDeploying}
            className="btn-primary w-full"
          >
            {isDeploying ? 'Deploying...' : 'Deploy Safe'}
          </button>
        </form>
      )}
    </div>
  );
}
