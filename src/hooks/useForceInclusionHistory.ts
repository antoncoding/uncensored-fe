import { useState, useEffect } from 'react';
import {
  createPublicClient,
  http,
  parseAbiItem,
  TransactionReceipt,
  Chain,
} from 'viem';
import { isAddress } from 'viem';
import { chainConfigs } from '@/config/chainConfig';
import { sepolia } from 'viem/chains';
import { UncensoredSDK } from '@rollup-uncensored/sdk';

const uncensored = new UncensoredSDK();

export enum TransactionStatus {
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export enum HistoryEntryType {
  L1_DEPOSIT = 'L1_DEPOSIT',
}

export interface L1DepositHistory {
  type: HistoryEntryType;
  txHash: string;
  timestamp: number;
  blockNumber: number;
  status: TransactionStatus;
  from: string;
  to: string;
  l1TxFee: bigint;
  l2TransactionHash?: string;
  l2Status?: TransactionStatus;
  l2Chain: Chain;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getL1RpcUrl = () => {
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  if (alchemyKey) {
    return `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`;
  }
  return process.env.NEXT_PUBLIC_L1_RPC_URL;
};

const processEventsInBatches = async (
  events: any[],
  l1Client: any,
  l2Client: any,
  chainId: number,
  batchSize: number = 10,
  delayMs: number = 1000
) => {
  const results: L1DepositHistory[] = [];

  for (let i = 0; i < events.length; i += batchSize) {
    const batch = events.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (event) => {
        const block = await l1Client.getBlock({ blockHash: event.blockHash });
        const receipt = (await l1Client.getTransactionReceipt({
          hash: event.transactionHash as `0x${string}`,
        })) as TransactionReceipt;

        // get l2 tx and status
        const l2TxHashes = uncensored.getL2TxHashes(receipt, chainId);
        const l2TxHash = l2TxHashes[0];

        let l2Status: TransactionStatus | undefined;

        if (l2TxHash) {
          try {
            const l2Receipt = await l2Client.getTransactionReceipt({
              hash: l2TxHash as `0x${string}`,
            });
            l2Status =
              l2Receipt.status === 'success'
                ? TransactionStatus.SUCCEEDED
                : TransactionStatus.FAILED;
          } catch (e) {
            l2Status = TransactionStatus.PENDING;
          }
        }

        return {
          type: HistoryEntryType.L1_DEPOSIT,
          txHash: event.transactionHash,
          timestamp: Number(block.timestamp),
          blockNumber: Number(block.number),
          status: TransactionStatus.SUCCEEDED,
          from: event.args.from,
          to: event.args.to,
          l2TransactionHash: l2TxHash,
          l2Status,
          l2Chain: chainConfigs[chainId].chain,
          l1TxFee: receipt.gasUsed * receipt.effectiveGasPrice,
        };
      })
    );

    results.push(...batchResults);

    if (i + batchSize < events.length) {
      await sleep(delayMs);
    }
  }

  return results;
};

export function useForceInclusionHistory(address: string) {
  const [histories, setHistories] = useState<L1DepositHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchHistory() {
      if (!address || !isAddress(address)) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const l1RpcUrl = getL1RpcUrl();
        if (!l1RpcUrl) {
          throw new Error('L1 RPC URL not configured');
        }

        const l1Client = createPublicClient({
          chain: sepolia,
          transport: http(l1RpcUrl),
        });

        const DEPOSIT_EVENT = parseAbiItem(
          'event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)'
        );

        const allHistories: L1DepositHistory[] = [];

        // Filter for OP Stack chains only
        const opStackChains = Object.entries(chainConfigs).filter(
          ([, config]) => config.isOpstack
        );

        // Process each chain sequentially to avoid too many concurrent requests
        for (const [chainId, config] of opStackChains) {
          const l2Client = createPublicClient({
            chain: config.chain,
            transport: http(),
          });

          const latestBlockNumber = await l1Client.getBlockNumber();
          const EVENT_QUERY_BLOCK_RANGE = BigInt(5000 - 100); // Block range limit is 5000. We reduce it further by 100 as a buffer
          const fromBlock = latestBlockNumber - EVENT_QUERY_BLOCK_RANGE;

          const events = await l1Client.getLogs({
            address: config.portalAddress,
            event: DEPOSIT_EVENT,
            args: {
              from: address,
            },
            fromBlock,
            toBlock: 'latest',
          });

          const chainHistories = await processEventsInBatches(
            events,
            l1Client,
            l2Client,
            Number(chainId)
          );

          allHistories.push(...chainHistories);
        }

        // Sort all histories by timestamp in descending order
        setHistories(allHistories.sort((a, b) => b.timestamp - a.timestamp));
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch history')
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [address, refreshKey]);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return { histories, isLoading, error, refresh };
}
