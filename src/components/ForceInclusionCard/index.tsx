import React, { useCallback, useState, useEffect } from 'react';
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
import { type SendTransactionVariables } from '@wagmi/core/query';

const uncensored = new UncensoredSDK();

const chains = [
  { key: 'optimism-sepolia', name: 'Optimism Sepolia', chainId: 11155420 },
  { key: 'arbitrum-sepolia', name: 'Arbitrum Sepolia', chainId: 421614 },
];

const ForceInclusionCard: React.FC = () => {
  const [selectedChain, setSelectedChain] =
    useState<string>('optimism-sepolia');
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<`0x${string}`>('0x');
  const [to, setTo] = useState<Address>('0x');
  const [gasLimit, setGasLimit] = useState<string>('150000');

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [pendingChainId, setPendingChainId] = useState<number | undefined>(
    sepolia.id
  );

  const { sendTransaction } = useSendTransaction();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: pendingChainId,
  });

  const onSuccess = useCallback(
    (hash: `0x${string}`, variables: SendTransactionVariables<any, any>) => {
      setPendingChainId(variables.chainId);
      setTxHash(hash);
    },
    []
  );

  // if switch chain, clear toast
  useEffect(() => {
    toast.dismiss('transaction-confirmation');
  }, [chainId]);

  // base on status, show toast
  useEffect(() => {
    if (!txHash) return;
    if (isSuccess) {
      toast.update('transaction-confirmation', {
        render: 'Transaction confirmed',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      });
      return;
    } else if (isLoading) {
      toast.loading('Transaction sent, waiting for confirmation...', {
        toastId: 'transaction-confirmation',
        onClick: () => {
          window.open(chainIdToExplorer(pendingChainId, txHash), '_blank');
        },
      });
      return;
    } else if (isError) {
      toast.update('transaction-confirmation', {
        render: 'Transaction failed',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }
  }, [isSuccess, isLoading, txHash, isError]);

  const sendTx = async () => {
    try {
      const expectedChainId =
        chains.find((chain) => chain.key === selectedChain)?.chainId ||
        optimismSepolia.id;
      if (chainId !== expectedChainId) {
        switchChain({ chainId: expectedChainId });
        toast.info('Switched to L2, click again to send');
        return;
      }

      const valueInWei = value ? parseEther(value) : BigInt(0);
      sendTransaction(
        {
          to: to as `0x${string}`,
          value: valueInWei,
          data,
          gas: BigInt(gasLimit),
        },
        {
          onSuccess,
        }
      );
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast.error('Failed to send transaction');
    }
  };

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
          onSuccess,
        }
      );
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast.error('Failed to send transaction');
    }
  };

  return (
    <Card className="p-6 w-full max-w-md shadow-md">
      <h2 className="text-2xl font-bold mb-4"> Force Inclusion </h2>
      <p className="text-sm text-gray-500 mb-6 m-2">
        Put in L2 transaction details, and we&apos;ll force it&apos;s inclusion
        on L1 🏰.
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
        <Button onPress={sendTx} disabled={isLoading}>
          Send L2 Tx
        </Button>
        <Button color="primary" onPress={forceSendTx} disabled={isLoading}>
          Force Send L1 Tx
        </Button>
      </div>
    </Card>
  );
};

export default ForceInclusionCard;
