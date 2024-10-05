import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
  Tooltip,
} from '@nextui-org/react';
import { Address, encodeFunctionData, isAddress } from 'viem';
import { toast } from 'react-toastify';

interface SmartModeInputProps {
  to: Address;
  selectedChain: string;
  onDataGenerated: (data: `0x${string}`) => void;
  proxyImplementationAddress: string;
  setProxyImplementationAddress: (address: string) => void;
}

const SmartModeInput: React.FC<SmartModeInputProps> = ({
  to,
  selectedChain,
  onDataGenerated,
  proxyImplementationAddress,
  setProxyImplementationAddress,
}) => {
  const [abi, setAbi] = useState<any[] | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [functionInputs, setFunctionInputs] = useState<{
    [key: string]: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (to && isAddress(to)) {
      fetchABI(
        proxyImplementationAddress && isAddress(proxyImplementationAddress)
          ? (proxyImplementationAddress as Address)
          : to
      );
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
        : 'https://api-sepolia.arbiscan.io/api';

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
        abi: [functionAbi],
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

  const writableFunctions =
    abi?.filter(
      (item: any) =>
        item.type === 'function' && !item.stateMutability.includes('view')
    ) || [];

  return (
    <div className="space-y-4">
      {isLoading && <p className="text-sm text-gray-500">Loading ABI...</p>}

      <Input label="To Address" value={to} isReadOnly size="sm" isDisabled />
      <Tooltip content="Use this if the contract is a proxy. Enter the implementation contract address.">
        <Input
          label="Proxy Implementation Address (optional)"
          placeholder="0x"
          type="text"
          value={proxyImplementationAddress}
          onChange={(e) => setProxyImplementationAddress(e.target.value)}
          size="sm"
        />
      </Tooltip>

      {abi && (
        <div className="flex flex-col gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                size="sm"
                className="text-xs max-w-fit"
              >
                {selectedFunction || 'Select function'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select function"
              className="max-h-[300px] overflow-y-auto"
              itemClasses={{
                base: 'py-2',
              }}
              ref={dropdownRef}
            >
              <DropdownSection title="Function to call">
                {writableFunctions.map((func: any, index: number) => (
                  <DropdownItem
                    key={`${func.name}-${index}`}
                    onClick={() => handleFunctionSelect(func.name)}
                  >
                    {func.name}
                  </DropdownItem>
                ))}
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>

          {selectedFunction &&
            abi
              .find((item: any) => item.name === selectedFunction)
              ?.inputs.map((input: any, index: number) => (
                <Input
                  key={`${input.name}-${index}`}
                  label={input.name}
                  placeholder={`Enter ${input.type}`}
                  value={functionInputs[input.name] || ''}
                  onChange={(e) =>
                    handleInputChange(input.name, e.target.value)
                  }
                  size="sm"
                />
              ))}

          <Button
            color="primary"
            onPress={generateData}
            size="sm"
            className="mt-2 max-w-fit"
            isDisabled={!selectedFunction}
          >
            Generate Data
          </Button>
        </div>
      )}
    </div>
  );
};

export default SmartModeInput;
