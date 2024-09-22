import React, { useState } from 'react';
import {
  Card,
  Input,
  Dropdown,
  Button,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { ethers, parseEther } from 'ethers';
import { UncensoredSDK } from 'uncensored-sdk';
import { useSendTransaction } from 'wagmi';
import { Address } from 'viem';

const uncensored = new UncensoredSDK();

const chains = [
  { key: 'optimism', name: 'Optimism' },
  { key: 'arbitrum', name: 'Arbitrum' },
];

const ForceInclusionCard: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState<string>('optimism');
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<`0x${string}`>('0x');
  const [to, setTo] = useState<Address>('0x');
  const [gasLimit, setGasLimit] = useState<string>('');

  const { sendTransaction } = useSendTransaction();

  const sendTx = async () => {
    try {
      const valueInWei = parseEther(value);
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
    // Empty function for force send
  };

  return (
    <Card className="p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
      <div className="space-y-4">
        <Input
          label="Value (ETH)"
          placeholder="Enter value in ETH"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Input
          label="Data"
          placeholder="Enter data"
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value as `0x${string}`)}
          errorMessage={!data.startsWith('0x') ? 'Invalid data' : undefined}
          isInvalid={!data.startsWith('0x')}
        />
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
