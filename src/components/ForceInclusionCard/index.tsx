import React, { useState } from 'react';
import {
  Card,
  Input,
  Dropdown,
  Button,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Textarea
} from '@nextui-org/react';
import { parseEther } from 'ethers';
import { UncensoredSDK } from 'uncensored-sdk';
import { useChainId, useSendTransaction, useSwitchChain } from 'wagmi';
import { Address } from 'viem';
import { mainnet, optimismSepolia, sepolia } from 'viem/chains';

const uncensored = new UncensoredSDK();

const chains = [
  { key: 'optimism-sepolia', name: 'Optimism Sepolia', chainId: 11155420 },
  { key: 'arbitrum-sepolia', name: 'Arbitrum Sepolia', chainId: 421614 },
];

const ForceInclusionCard: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState<string>('optimism-sepolia');
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<`0x${string}`>('0x');
  const [to, setTo] = useState<Address>('0x');
  const [gasLimit, setGasLimit] = useState<string>('');

  const { sendTransaction } = useSendTransaction();

  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const sendTx = async () => {
    try {
      const valueInWei = value ? parseEther(value) : BigInt(0);
      sendTransaction({
        to: to as `0x${string}`,
        value: valueInWei,
        data,
        gas: BigInt(gasLimit),
      });
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  const forceSendTx = () => {
    // if not on mainnet, switch to mainnet first and then return
    if (chainId !== sepolia.id) {
      switchChain({ chainId: sepolia.id });
      return;
    }
    try {
      const valueInWei = value ? parseEther(value) : BigInt(0);
      const l1Tx = uncensored.transformTransaction({
        to: to as `0x${string}`,
        value: valueInWei,
        data,
        gasLimit: gasLimit,
        chainId: chains.find((chain) => chain.key === selectedChain)?.chainId || optimismSepolia.id,
      });
      
      sendTransaction({
        to: l1Tx.to,
        value: l1Tx.value,
        data: l1Tx.data as `0x${string}`,
      });
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  return (
    <Card className="p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
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
      <div className="flex justify-end space-x-4 mt-6">
        <Button onPress={sendTx}>Send Tx</Button>
        <Button color="primary" onPress={forceSendTx}>
          Force Send Tx
        </Button>
      </div>
    </Card>
  );
};

export default ForceInclusionCard;
