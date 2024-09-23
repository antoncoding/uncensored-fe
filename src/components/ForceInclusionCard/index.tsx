import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  Card,
  Input,
  Dropdown,
  Button,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Textarea,
} from '@nextui-org/react';
import { parseEther } from 'ethers';
import { UncensoredSDK } from '@rollup-uncensored/sdk';
import {
  useChainId,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { Address } from 'viem';
import { optimismSepolia, sepolia } from 'viem/chains';
import { toast } from 'react-toastify';
import { chainIdToExplorer } from '@/utils/chains';

const uncensored = new UncensoredSDK();

const chains = [
  { key: 'optimism-sepolia', name: 'Optimism Sepolia', chainId: 11155420 },
  { key: 'arbitrum-sepolia', name: 'Arbitrum Sepolia', chainId: 421614 },
];

const ForceInclusionCard: React.FC = () => {
  const [selectedChain, setSelectedChain] =
    useState<string>('optimism-sepolia');

  // todo: make this dynamic in the future
  const l1ChainId = sepolia.id;

  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<`0x${string}`>('0x');
  const [to, setTo] = useState<Address>('0x');
  const [gasLimit, setGasLimit] = useState<string>('150000');

  // L1 transaction states
  const [l1TxHash, setL1TxHash] = useState<`0x${string}` | undefined>();

  // L2 transaction states
  const [l2TxHash, setL2TxHash] = useState<`0x${string}` | undefined>();

  const { sendTransaction } = useSendTransaction();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // fetch
  const l2ChainId = useMemo(
    () =>
      chains.find((chain) => chain.key === selectedChain)?.chainId ||
      optimismSepolia.id,
    [selectedChain]
  );

  const {
    data: l1Receipt,
    isLoading: isL1Loading,
    isSuccess: isL1Success,
    isError: isL1Error,
  } = useWaitForTransactionReceipt({
    hash: l1TxHash,
    chainId: l1ChainId,
    query: {
      enabled: !!l1TxHash,
    },
  });

  const {
    isLoading: isL2Loading,
    isSuccess: isL2Success,
    isError: isL2Error,
  } = useWaitForTransactionReceipt({
    hash: l2TxHash,
    chainId: l2ChainId,
    query: {
      enabled: !!l2TxHash && isL1Success,
    },
  });

  /**
   * When L1 transaction is successfully sent to the network
   */
  const onL1Success = useCallback(async (hash: `0x${string}`) => {
    setL1TxHash(hash);
  }, []);

  const formatTxHash = (hash: `0x${string}`) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  // Handle L1 transaction status
  useEffect(() => {
    if (!l1TxHash) return;
    if (isL1Success) {
      toast.update('l1-transaction-confirmation', {
        render: (
          <div className="p-2">
            <div>L1 transaction confirmed! 🎉</div>
            <div className="text-xs font-mono underline-on-hover py-2">
              {formatTxHash(l1TxHash)}
            </div>
          </div>
        ),
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        onClick: () => {
          window.open(chainIdToExplorer(l1ChainId, l1TxHash), '_blank');
        },
      });
      const l2Hashes = uncensored.getL2TxHashes(l1Receipt, l2ChainId);
      if (l2Hashes.length > 0) {
        const l2Hash = l2Hashes[0];
        setL2TxHash(l2Hash);
      }
    } else if (isL1Loading) {
      toast.loading(
        <div className="p-2">
          <div>L1 transaction sent, waiting for confirmation...</div>
          <div className="text-xs font-mono underline-on-hover py-2">
            {formatTxHash(l1TxHash)}
          </div>
        </div>,
        {
          toastId: 'l1-transaction-confirmation',
          onClick: () => {
            window.open(chainIdToExplorer(l1ChainId, l1TxHash), '_blank');
          },
        }
      );
    } else if (isL1Error) {
      toast.update('l1-transaction-confirmation', {
        render: (
          <div className="p-2">
            <div>L1 transaction failed! ❌</div>
            <div className="text-xs font-mono underline-on-hover py-2">
              {formatTxHash(l1TxHash)}
            </div>
          </div>
        ),
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        onClick: () => {
          window.open(chainIdToExplorer(l1ChainId, l1TxHash), '_blank');
        },
      });
    }
  }, [
    isL1Success,
    isL1Loading,
    l1TxHash,
    isL1Error,
    l1ChainId,
    l1Receipt,
    l2ChainId,
  ]);

  // Handle L2 transaction status
  useEffect(() => {
    if (!l2TxHash) return;
    if (isL2Success) {
      toast.update('l2-transaction-confirmation', {
        render: (
          <div className="p-2">
            <div>L2 transaction confirmed! 🎉</div>
            <div className="text-xs font-mono underline-on-hover py-2">
              {formatTxHash(l2TxHash)}
            </div>
            <div>Transaction force included!</div>
          </div>
        ),
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        onClick: () => {
          window.open(chainIdToExplorer(l2ChainId, l2TxHash), '_blank');
        },
      });
    } else if (isL2Loading) {
      toast.loading(
        <div className="p-2">
          <div>Waiting for transaction on L2...</div>
          <div className="text-xs font-mono underline-on-hover py-2">
            {formatTxHash(l2TxHash)}
          </div>
        </div>,
        {
          toastId: 'l2-transaction-confirmation',
          onClick: () => {
            window.open(chainIdToExplorer(l2ChainId, l2TxHash), '_blank');
          },
        }
      );
    } else if (isL2Error) {
      toast.update('l2-transaction-confirmation', {
        render: (
          <div className="p-2">
            <div>L2 transaction failed! ❌</div>
            <div className="text-xs font-mono underline-on-hover py-2">
              {formatTxHash(l2TxHash)}
            </div>
          </div>
        ),
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        onClick: () => {
          window.open(chainIdToExplorer(l2ChainId, l2TxHash), '_blank');
        },
      });
    }
  }, [isL2Success, isL2Loading, l2TxHash, isL2Error, l2ChainId]);

  const forceSendTx = async () => {
    if (chainId !== sepolia.id) {
      switchChain({ chainId: sepolia.id });
      toast.info('Switched to Sepolia, click again to send');
      return;
    }
    try {
      const valueInWei = value ? parseEther(value) : BigInt(0);
      const l1Tx = uncensored.transformTransaction({
        to: to as `0x${string}`,
        value: valueInWei,
        data,
        gasLimit: gasLimit,
        chainId:
          chains.find((chain) => chain.key === selectedChain)?.chainId ||
          optimismSepolia.id,
      });

      sendTransaction(
        {
          to: l1Tx.to,
          value: l1Tx.value,
          data: l1Tx.data as `0x${string}`,
          chainId: sepolia.id,
        },
        {
          onSuccess: onL1Success,
        }
      );
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast.error('Failed to send transaction');
    }
  };

  return (
    <Card className="p-8 w-full max-w-md shadow-md bg-card">
      <h2 className="text-2xl font-bold mb-4"> Force Inclusion </h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter L2 transaction details, and we&apos;ll force its inclusion on L1
        🏰.
      </p>
      <div className="space-y-4">
        <Input
          label="To"
          placeholder="Enter recipient address"
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value as Address)}
          errorMessage={!to.startsWith('0x') ? 'Invalid address' : undefined}
          isInvalid={!to.startsWith('0x')}
        />
        <Input
          label="Value (ETH)"
          placeholder="Enter value in ETH"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Textarea
          label="Data"
          placeholder="Enter data"
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value as `0x${string}`)}
          errorMessage={!data.startsWith('0x') ? 'Invalid data' : undefined}
          isInvalid={!data.startsWith('0x')}
        />
        <Input
          label="Gas Limit"
          placeholder="Enter gas limit"
          type="number"
          value={gasLimit}
          onChange={(e) => setGasLimit(e.target.value)}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">
              {selectedChain
                ? chains.find((chain) => chain.key === selectedChain)?.name
                : 'Select chain'}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Select chain">
            {chains.map((chain) => (
              <DropdownItem
                key={chain.key}
                onClick={() => setSelectedChain(chain.key)}
              >
                {chain.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="flex justify-end space-x-4 mt-8">
        <Button color="primary" onPress={forceSendTx} disabled={isL1Loading}>
          Force Send L1 Tx
        </Button>
      </div>
    </Card>
  );
};

export default ForceInclusionCard;
