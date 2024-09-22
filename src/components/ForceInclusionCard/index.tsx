import React from 'react';
import {
  Card,
  Input,
  Dropdown,
  Button,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';

const chains = [
  { key: 'optimism', name: 'Optimism' },
  { key: 'arbitrum', name: 'Arbitrum' },
];

const ForceInclusionCard: React.FC = () => {
  const [selectedChain, setSelectedChain] = React.useState<string>('optimism');

  const sendTx = () => {
    // Empty function for regular send
  };

  const forceSendTx = () => {
    // Empty function for force send
  };

  return (
    <Card className="p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
      <div className="space-y-4">
        <Input label="Value" placeholder="Enter value" type="text" />
        <Input label="Data" placeholder="Enter data" type="text" />
        <Input label="To" placeholder="Enter recipient address" type="text" />
        <Input label="Gas Limit" placeholder="Enter gas limit" type="number" />
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
