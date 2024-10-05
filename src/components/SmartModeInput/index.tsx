import React, { useState, useEffect } from 'react';
import {
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';
import { Address, encodeFunctionData } from 'viem';
import { toast } from 'react-toastify';

interface SmartModeInputProps {
  to: Address;
  selectedChain: string;
  onDataGenerated: (data: `0x${string}`) => void;
}

const SmartModeInput: React.FC<SmartModeInputProps> = ({
  to,
  selectedChain,
  onDataGenerated,
}) => {
  const [abi, setAbi] = useState<any[] | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [functionInputs, setFunctionInputs] = useState<{
    [key: string]: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [proxyImplementationAddress, setProxyImplementationAddress] =
    useState<`0x${string}` | null>(null);

  useEffect(() => {
    if (to) {
      fetchABI(proxyImplementationAddress ? proxyImplementationAddress : to);
    } else {
      setAbi(null);
      setSelectedFunction(null);
      setFunctionInputs({});
    }
  }, [to, selectedChain, proxyImplementationAddress]);

  const fetchABI = async (address: Address) => {
    setIsLoading(true);
    const apiKey =
      selectedChain === 'optimism-sepolia'
        ? process.env.NEXT_PUBLIC_OPTIMISM_ETHERSCAN_API_KEY
        : process.env.NEXT_PUBLIC_ARBITRUM_ETHERSCAN_API_KEY;

    const apiUrl =
      selectedChain === 'optimism-sepolia'
        ? 'https://api-sepolia-optimistic.etherscan.io/api'
        : 'https://api.arbiscan.io/api';

    try {
      const response = await fetch(
        `${apiUrl}?module=contract&action=getabi&address=${address}&apikey=${apiKey}`
      );
      const data = await response.json();
      if (data.status === '1') {
        setAbi(JSON.parse(data.result));
      } else {
        toast.error('Failed to fetch ABI');
      }
    } catch (error) {
      console.error('Error fetching ABI:', error);
      toast.error('Error fetching ABI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFunctionSelect = (functionName: string) => {
    setSelectedFunction(functionName);
    setFunctionInputs({});
  };

  const handleInputChange = (name: string, value: string) => {
    setFunctionInputs((prev) => ({ ...prev, [name]: value }));
  };

  const generateData = () => {
    if (!abi || !selectedFunction) return;

    const functionAbi = abi.find((item: any) => item.name === selectedFunction);
    if (!functionAbi) return;

    try {
      const data = encodeFunctionData({
        abi: abi,
        functionName: selectedFunction,
        args: functionAbi.inputs.map(
          (input: any) => functionInputs[input.name]
        ),
      });
      onDataGenerated(data);
    } catch (error) {
      console.error('Error encoding function data:', error);
      toast.error('Invalid input data');
    }
  };

  if (!to) {
    return (
      <p className="text-sm text-gray-500">
        Enter a target address to auto-fetch ABI
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading ABI...</p>;
  }

  if (!abi) {
    return null;
  }

  const writableFunctions = abi.filter(
    (item: any) =>
      item.type === 'function' && !item.stateMutability.includes('view')
  );

  return (
    <div className="space-y-4">
      <Input
        label="Proxy Implementation Address (optional)"
        placeholder="0x"
        type="text"
        value={proxyImplementationAddress || ''}
        onValueChange={(value) => setProxyImplementationAddress(value as `0x${string}`)}
        size="sm"
      />

      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" size="sm">
            {selectedFunction || 'Select function'}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Select function">
          <DropdownItem key="header" className="opacity-50" isReadOnly>
            Function to call
          </DropdownItem>
          {writableFunctions.map((func: any) => (
            <DropdownItem
              key={func.name}
              onClick={() => handleFunctionSelect(func.name)}
            >
              {func.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {selectedFunction &&
        abi
          .find((item: any) => item.name === selectedFunction)
          .inputs.map((input: any) => (
            <Input
              key={input.name}
              label={input.name}
              placeholder={`Enter ${input.type}`}
              value={functionInputs[input.name] || ''}
              onChange={(e) => handleInputChange(input.name, e.target.value)}
              size="sm"
            />
          ))}

      <Button color="primary" onPress={generateData} size="sm">
        Generate Data
      </Button>
    </div>
  );
};

export default SmartModeInput;
