export interface Transaction {
  id: bigint;
  destination: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
  executed: boolean;
  confirmations: `0x${string}`[];
  confirmationCount: number;
}

export interface MultiSigWallet {
  address: `0x${string}`;
  owners: `0x${string}`[];
  required: number;
  balance: bigint;
  transactionCount: number;
}

export interface WalletState {
  wallet: MultiSigWallet | null;
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  executedTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export type TransactionStatus = 'pending' | 'ready' | 'executed' | 'failed';

export interface SubmitTransactionParams {
  destination: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
}
