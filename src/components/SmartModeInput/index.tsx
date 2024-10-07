import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
  Link,
} from '@nextui-org/react';
import { Address, encodeFunctionData, isAddress } from 'viem';
import { toast } from 'react-toastify';
import { chainIdToAddressExplorer } from '@/utils/chains';
import { arbitrumSepolia, optimismSepolia } from 'viem/chains';
import { HiCheck } from 'react-icons/hi';
import { RxCrossCircled } from 'react-icons/rx';

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
    useState<string>('');
  const [isEditingImplementation, setIsEditingImplementation] =
    useState<boolean>(false);
  const [manualImplementationAddress, setManualImplementationAddress] =
    useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isProxyDetected, setIsProxyDetected] = useState<boolean>(false);

  useEffect(() => {
    if (to && isAddress(to)) {
      checkIfProxy(to);
    } else {
      setAbi(null);
      setSelectedFunction(null);
      setFunctionInputs({});
      setProxyImplementationAddress('');
    }
  }, [to, selectedChain]);

  const getApiKey = () => {
    return selectedChain === 'optimism-sepolia'
      ? process.env.NEXT_PUBLIC_OPTIMISM_ETHERSCAN_API_KEY
      : process.env.NEXT_PUBLIC_ARBITRUM_ETHERSCAN_API_KEY;
  };

  const getApiUrl = () => {
    return selectedChain === 'optimism-sepolia'
      ? 'https://api-sepolia-optimistic.etherscan.io/api'
      : 'https://api-sepolia.arbiscan.io/api';
  };

  const checkIfProxy = async (address: Address) => {
    setIsLoading(true);
    const apiKey = getApiKey();
    const apiUrl = getApiUrl();

    try {
      const response = await fetch(
        `${apiUrl}?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`
      );
      const data = await response.json();
      if (data.status === '1' && data.result[0].Implementation) {
        setProxyImplementationAddress(data.result[0].Implementation);
        setIsProxyDetected(true);
        fetchABI(data.result[0].Implementation as Address);
      } else {
        setProxyImplementationAddress('');
        setIsProxyDetected(false);
        fetchABI(address);
      }
    } catch (error) {
      console.error('Error checking if proxy:', error);
      toast.error('Error checking contract type');
      setIsLoading(false);
    }
  };

  const fetchABI = async (address: Address) => {
    const apiKey = getApiKey();
    const apiUrl = getApiUrl();

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
        item.type === 'function' &&
        !['view', 'pure'].includes(item.stateMutability)
    ) || [];

  const handleChangeImplementation = () => {
    setIsEditingImplementation(true);
    setManualImplementationAddress(proxyImplementationAddress);
  };

  const handleSaveImplementation = () => {
    if (isAddress(manualImplementationAddress)) {
      setProxyImplementationAddress(manualImplementationAddress);
      fetchABI(manualImplementationAddress as Address);
      setIsEditingImplementation(false);
      setIsProxyDetected(true);
    } else {
      toast.error('Invalid address');
    }
  };

  const getExplorerLink = (address: string) => {
    const chainId =
      selectedChain === 'optimism-sepolia'
        ? optimismSepolia.id
        : arbitrumSepolia.id;
    return chainIdToAddressExplorer(chainId, address);
  };

  return (
    <div className="space-y-4">
      {isLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading contract information...
        </p>
      )}

      <Input label="To Address" value={to} isReadOnly size="sm" isDisabled />

      {!isEditingImplementation && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-dashed border-blue-200 dark:border-blue-700 rounded-lg p-3 flex items-center justify-between">
          <div>
            {isProxyDetected ? (
              <>
                <span className="text-xs text-blue-700 dark:text-blue-300">
                  Proxy detected, using ABI from{' '}
                </span>
                <Link
                  href={getExplorerLink(proxyImplementationAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {proxyImplementationAddress.slice(0, 6)}...
                  {proxyImplementationAddress.slice(-4)}
                </Link>
              </>
            ) : (
              <span className="text-sm text-blue-700 dark:text-blue-300">
                No proxy detected
              </span>
            )}
          </div>
          <button
            onClick={handleChangeImplementation}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
          >
            {isProxyDetected ? 'Change' : 'Add implementation'}
          </button>
        </div>
      )}

      {isEditingImplementation && (
        <div className="flex items-center space-x-2">
          <Input
            label="Implementation Address"
            value={manualImplementationAddress}
            onChange={(e) => setManualImplementationAddress(e.target.value)}
            size="sm"
          />
          <Button size="md" isIconOnly onClick={handleSaveImplementation}>
            <HiCheck size={20} />
          </Button>
          <Button
            size="md"
            isIconOnly
            onClick={() => setIsEditingImplementation(false)}
          >
            {' '}
            <RxCrossCircled size={20} />{' '}
          </Button>
        </div>
      )}

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
