'use client';

import { useState } from 'react';
import { useAccount, useWalletClient, useSwitchChain, usePublicClient } from 'wagmi';
import { isAddress, type Address, encodeDeployData, formatEther } from 'viem';
import { base } from 'wagmi/chains';
import MultiSigWalletArtifact from '../../artifacts/src/contracts/MultiSigWallet.sol/MultiSigWallet.json';

interface DeploySafeProps {
  onBack?: () => void;
}

export function DeploySafe({ onBack }: DeploySafeProps) {
  const { address, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();
  const publicClient = usePublicClient();

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
    const validOwners = owners.filter(o => o.trim() !== '') as Address[];
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

    if (!publicClient) {
      setError('Network not available');
      return;
    }

    try {
      setIsDeploying(true);

      // Ensure we're on Base chain
      if (chainId !== base.id) {
        console.log('Switching to Base chain...');
        await switchChainAsync({ chainId: base.id });
      }

      // Check balance before deploying
      const balance = await publicClient.getBalance({ address: walletClient.account.address });
      console.log('Account balance:', formatEther(balance), 'ETH');

      if (balance === BigInt(0)) {
        setError('Insufficient ETH balance on Base. You need ETH to pay for gas.');
        setIsDeploying(false);
        return;
      }

      console.log('Deploying MultiSigWallet with the account:', walletClient.account.address);
      console.log('Chain ID:', base.id);
      console.log('Owners:', validOwners);
      console.log('Required confirmations:', requiredConfirmations);

      // Deploy using viem walletClient directly
      const hash = await walletClient.deployContract({
        abi: MultiSigWalletArtifact.abi,
        bytecode: MultiSigWalletArtifact.bytecode as `0x${string}`,
        args: [validOwners, BigInt(requiredConfirmations)],
        chain: base,
      });

      console.log('Deployment transaction sent:', hash);
      console.log('Waiting for confirmation...');

      // Wait for the transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.contractAddress) {
        console.log('MultiSigWallet deployed to:', receipt.contractAddress);
        setDeployedAddress(receipt.contractAddress);
      } else {
        setError('Contract deployment failed - no contract address returned');
      }
    } catch (err: any) {
      console.error('Deployment error:', err);
      console.error('Error name:', err.name);
      console.error('Error cause:', err.cause);
      console.error('Error details:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));

      // Parse common error messages
      let errorMessage = err.shortMessage || err.message || 'Failed to deploy Safe';

      // Check for specific error types
      if (errorMessage.includes('insufficient funds') || errorMessage.includes('exceeds the balance')) {
        errorMessage = 'Insufficient ETH balance on Base to pay for gas';
      } else if (errorMessage.includes('user rejected') || errorMessage.includes('denied') || errorMessage.includes('User rejected')) {
        errorMessage = 'Transaction was rejected';
      }
      // For other errors, show the actual message for debugging

      setError(errorMessage);
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
