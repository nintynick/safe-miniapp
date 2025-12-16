'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi';
import { multiSigWalletABI } from '@/lib/abi';
import type { Transaction } from '@/types/multisig';

export function useMultiSigWallet(walletAddress: `0x${string}` | undefined) {
  const { address: userAddress } = useAccount();

  const { data: balance } = useBalance({
    address: walletAddress,
  });

  const { data: owners } = useReadContract({
    address: walletAddress,
    abi: multiSigWalletABI,
    functionName: 'getOwners',
  });

  const { data: required } = useReadContract({
    address: walletAddress,
    abi: multiSigWalletABI,
    functionName: 'required',
  });

  const { data: transactionCount } = useReadContract({
    address: walletAddress,
    abi: multiSigWalletABI,
    functionName: 'transactionCount',
  });

  const { data: isOwner } = useReadContract({
    address: walletAddress,
    abi: multiSigWalletABI,
    functionName: 'isOwner',
    args: userAddress ? [userAddress] : undefined,
  });

  return {
    balance: balance?.value,
    owners: owners as `0x${string}`[] | undefined,
    required: required ? Number(required) : undefined,
    transactionCount: transactionCount ? Number(transactionCount) : 0,
    isOwner: !!isOwner,
    userAddress,
  };
}

export function useTransaction(walletAddress: `0x${string}` | undefined, transactionId: bigint | undefined) {
  const { data: transaction } = useReadContract({
    address: walletAddress,
    abi: multiSigWalletABI,
    functionName: 'getTransaction',
    args: transactionId !== undefined ? [transactionId] : undefined,
  });

  const { data: confirmations } = useReadContract({
    address: walletAddress,
    abi: multiSigWalletABI,
    functionName: 'getConfirmations',
    args: transactionId !== undefined ? [transactionId] : undefined,
  });

  const { data: confirmationCount } = useReadContract({
    address: walletAddress,
    abi: multiSigWalletABI,
    functionName: 'getConfirmationCount',
    args: transactionId !== undefined ? [transactionId] : undefined,
  });

  const { data: isConfirmed } = useReadContract({
    address: walletAddress,
    abi: multiSigWalletABI,
    functionName: 'isConfirmed',
    args: transactionId !== undefined ? [transactionId] : undefined,
  });

  if (!transaction || transactionId === undefined) {
    return null;
  }

  const [destination, value, data, executed] = transaction;

  return {
    id: transactionId,
    destination,
    value,
    data,
    executed,
    confirmations: (confirmations as `0x${string}`[]) || [],
    confirmationCount: confirmationCount ? Number(confirmationCount) : 0,
    isConfirmed: !!isConfirmed,
  } as Transaction & { isConfirmed: boolean };
}

export function useSubmitTransaction(walletAddress: `0x${string}` | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const submitTransaction = (destination: `0x${string}`, value: bigint, data: `0x${string}`) => {
    if (!walletAddress) return;

    writeContract({
      address: walletAddress,
      abi: multiSigWalletABI,
      functionName: 'submitTransaction',
      args: [destination, value, data],
    });
  };

  return {
    submitTransaction,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useConfirmTransaction(walletAddress: `0x${string}` | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const confirmTransaction = (transactionId: bigint) => {
    if (!walletAddress) return;

    writeContract({
      address: walletAddress,
      abi: multiSigWalletABI,
      functionName: 'confirmTransaction',
      args: [transactionId],
    });
  };

  return {
    confirmTransaction,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useRevokeConfirmation(walletAddress: `0x${string}` | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const revokeConfirmation = (transactionId: bigint) => {
    if (!walletAddress) return;

    writeContract({
      address: walletAddress,
      abi: multiSigWalletABI,
      functionName: 'revokeConfirmation',
      args: [transactionId],
    });
  };

  return {
    revokeConfirmation,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useExecuteTransaction(walletAddress: `0x${string}` | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const executeTransaction = (transactionId: bigint) => {
    if (!walletAddress) return;

    writeContract({
      address: walletAddress,
      abi: multiSigWalletABI,
      functionName: 'executeTransaction',
      args: [transactionId],
    });
  };

  return {
    executeTransaction,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
