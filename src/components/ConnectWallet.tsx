'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="glass rounded-lg px-3 py-2">
          <span className="text-white/60 text-sm">Connected:</span>
          <span className="text-white ml-2 font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="btn-secondary text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  const farcasterConnector = connectors[0];

  return (
    <div className="flex flex-col items-center gap-4">
      {farcasterConnector && (
        <button
          onClick={() => connect({ connector: farcasterConnector })}
          disabled={isPending}
          className="btn-primary w-full"
        >
          {isPending ? 'Connecting...' : 'Connect Farcaster Wallet'}
        </button>
      )}
    </div>
  );
}
