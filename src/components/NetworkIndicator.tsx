'use client';

import { useChainId, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';

export function NetworkIndicator() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isBase = chainId === base.id;

  if (!isBase) {
    return (
      <div className="card bg-red-500/10 border border-red-500/20">
        <p className="text-red-400 text-sm font-semibold mb-2">
          Wrong Network
        </p>
        <p className="text-white/60 text-xs mb-3">
          Please switch to Base Mainnet to use this app
        </p>
        <button
          onClick={() => switchChain({ chainId: base.id })}
          className="btn-primary text-xs w-full"
        >
          Switch to Base Mainnet
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-400" />
        <div>
          <p className="text-white/60 text-xs">Network</p>
          <p className="text-white text-sm font-medium">Base Mainnet</p>
        </div>
      </div>
    </div>
  );
}
