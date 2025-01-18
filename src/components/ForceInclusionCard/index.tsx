'use client';

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  Card,
  Input,
  Dropdown,
  Button,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from '@nextui-org/react';
import { parseEther } from 'ethers';
import {
  useChainId,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { Address, isAddress } from 'viem';
import { toast } from 'react-toastify';
import { chainIdToExplorer } from '@/utils/chains';
import SmartModeInput from '../SmartModeInput';
import { addCustomNetwork } from '@/config/customNetworks';
import { IoTimeOutline } from 'react-icons/io5';
import { BsQuestionCircle } from "react-icons/bs";
import Image from 'next/image';
import { L1_CHAIN } from '@/config/environment';
import { CiWarning } from 'react-icons/ci';
import AddNetworkModal from '../Setting/AddNetworkModal';
import { getAllChainConfigs, getSDKWithCurrentConfigs } from '@/config/chainConfig';
import { TbCircleLetterC } from "react-icons/tb";


// Get supported chains from chainConfigs

const ForceInclusionCard: React.FC = () => {
  const [chains, setChains] = useState(getAllChainConfigs());
  const [l2ChainId, setL2ChainId] = useState<number>(chains[0]?.chainId || 0);

  const selectedChain = Object.values(chains).find((chain) => chain.chainId === l2ChainId);
  const l1ChainId = L1_CHAIN.id;

  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [gasLimit, setGasLimit] = useState<string>('');

  // L1 transaction states
  const [l1TxHash, setL1TxHash] = useState<`0x${string}` | undefined>();

  // L2 transaction states
  const [l2TxHash, setL2TxHash] = useState<`0x${string}` | undefined>();

  const { sendTransaction } = useSendTransaction();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isAddNetworkOpen, setIsAddNetworkOpen] = useState(false);

  const handleAddNetwork = (networkData: {
    name: string;
    chainId: number;
    optimismPortalAddress: string;
    rpcUrl: string;
  }) => {
    

    const newConfig = {
      ...networkData,
      optimismPortalAddress: networkData.optimismPortalAddress as `0x${string}`,
      isOpstack: true,
      maxWaitTime: 12 * 3600, // 12 hours
    };

    addCustomNetwork(networkData.chainId, newConfig);
    setChains(getAllChainConfigs()); // Refresh chains list
    toast.success('Network added successfully!');
    setL2ChainId(networkData.chainId);
  };

  // Refresh chains when custom networks change
  useEffect(() => {
    const handleStorageChange = () => {
      setChains(getAllChainConfigs());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const {
    data: l1Receipt,
    isLoading: isL1Loading,
    isSuccess: isL1Success,
    isError: isL1Error,
    error: l1Error,
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
    error: l2Error,
  } = useWaitForTransactionReceipt({
    hash: l2TxHash,
    chainId: l2ChainId,
    query: {
      enabled: !!l2TxHash && isL1Success,
      retry: true,
      refetchInterval: 5_000,
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
      const uncensoredSDK = getSDKWithCurrentConfigs();
      const l2Hashes = uncensoredSDK.getL2TxHashes(l1Receipt, l2ChainId);
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
    if (chainId !== L1_CHAIN.id) {
      switchChain({ chainId: L1_CHAIN.id });
      toast.info('Switched to Sepolia, click again to send');
      return;
    }

    if (!gasLimit) {
      toast.error('Please enter a gas limit');
      return;
    }

    try {
      const valueInWei = value ? parseEther(value) : BigInt(0);
      const uncensoredSDK = getSDKWithCurrentConfigs();
      const l1Tx = uncensoredSDK.transformTransaction({
        to: to as `0x${string}`,
        value: valueInWei,
        data,
        gasLimit: gasLimit,
        chainId: l2ChainId
      });

      sendTransaction(
        {
          to: l1Tx.to,
          value: l1Tx.value,
          data: l1Tx.data as `0x${string}`,
          chainId: L1_CHAIN.id,
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

  const handleDataGenerated = (generatedData: `0x${string}`) => {
    setData(generatedData);
    onClose();
  };

  const handleComposeDataClick = () => {
    if (!to || !isAddress(to)) {
      toast.error('Please enter a valid "To" address before composing data.');
    } else {
      onOpen();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 font-inter min-h-screen">
      <h1 className="text-3xl mb-12 pt-8">Force Transaction Inclusion</h1>
      <Card className="p-6 h-full">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm ">Target L2 Chain</h3>
              <Tooltip content="Select the L2 chain where you want to include this transaction">
                <button className="focus:outline-none">
                  <BsQuestionCircle
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    size={14}
                  />
                </button>
              </Tooltip>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="capitalize"
                  startContent={
                    selectedChain?.logo ? (
                      <Image
                        src={selectedChain.logo}
                        alt="Chain Logo"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <TbCircleLetterC size={24} />
                    )
                  }
                >
                  {selectedChain?.name}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select chain"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={new Set([l2ChainId])}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  if (selected !== 'add-network') { 
                    setL2ChainId(Number(selected));
                  }
                }}
                className="p-3"
                itemClasses={{
                  base: [
                    "rounded-md",
                    "text-default-500",
                    "transition-opacity",
                    "data-[hover=true]:text-foreground",
                    "data-[hover=true]:bg-default-100",
                    "dark:data-[hover=true]:bg-default-50",
                    "data-[selectable=true]:focus:bg-default-50",
                    "data-[pressed=true]:opacity-70",
                    "data-[focus-visible=true]:ring-default-500",
                  ],
                }}
              >
                <DropdownSection showDivider aria-label="Available Networks">
                  {Object.values(chains).map((chain) => (
                    <DropdownItem key={chain.chainId}>
                      <div className="flex items-center gap-2">
                        {chain.logo ? <Image
                          src={chain.logo}
                          alt={chain.name}
                          width={24}
                          height={24}
                        /> : <TbCircleLetterC /> }
                        {chain.name}
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownSection>
                <DropdownSection aria-label="Actions">
                  <DropdownItem
                    key="add-network"
                    className="text-primary"
                    onClick={() => setIsAddNetworkOpen(true)}
                    endContent={<span className="text-xl">+</span>}
                  >
                    Add Network
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm ">To Address</h3>
              <Tooltip content="The contract address to call on L2">
                <button className="focus:outline-none">
                  <BsQuestionCircle
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    size={14}
                  />
                </button>
              </Tooltip>
            </div>
            <Input
              placeholder="0x"
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value as Address)}
              errorMessage={
                to && !to.startsWith('0x') ? 'Invalid address' : undefined
              }
              isInvalid={!!(to && !to.startsWith('0x'))}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm ">Value (ETH)</h3>
              <Tooltip content="Amount of ETH to send with the transaction">
                <button className="focus:outline-none">
                  <BsQuestionCircle
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    size={14}
                  />
                </button>
              </Tooltip>
            </div>
            <Input
              placeholder="Enter value in ETH"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm ">Transaction Data</h3>
              <Tooltip content="The calldata for the transaction. Use the ABI composer for smart contract interactions">
                <button className="focus:outline-none">
                  <BsQuestionCircle
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    size={14}
                  />
                </button>
              </Tooltip>
            </div>
            <Textarea
              placeholder="0x"
              value={data}
              onChange={(e) => setData(e.target.value as `0x${string}`)}
              errorMessage={
                data && !data.startsWith('0x') ? 'Invalid data' : undefined
              }
              isInvalid={!!(data && !data.startsWith('0x'))}
            />
            <div className="mt-1">
              <Tooltip content="Compose transaction data using contract ABI">
                <span
                  className="text-xs text-gray-500 cursor-pointer underline ml-2"
                  onClick={handleComposeDataClick}
                >
                  Compose data with ABI
                </span>
              </Tooltip>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm ">Gas Limit</h3>
              <Tooltip content="Maximum amount of gas that can be used for this transaction">
                <button className="focus:outline-none">
                  <BsQuestionCircle
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    size={14}
                  />
                </button>
              </Tooltip>
            </div>
            <Input
              type="number"
              placeholder="Enter gas limit"
              value={gasLimit}
              onChange={(e) => setGasLimit(e.target.value)}
            />
          </div>

          {(isL1Error || isL2Error) && (
            <div className="flex items-center gap-2 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
              <CiWarning size={20} className="flex-shrink-0" />
              <span className="text-sm">
                Error:{' '}
                {(isL1Error && l1Error.message) ||
                  (isL2Error && l2Error.message)}
              </span>
            </div>
          )}

          {!isL1Loading && !isL2Loading && !isL1Error && !isL2Error && (
            <div className="flex justify-end gap-2">
              <Button color="primary" onClick={forceSendTx}>
                Submit
              </Button>
            </div>
          )}

          {selectedChain?.maxWaitTime && (
            <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
              <IoTimeOutline className="text-gray-400" size={16} />
              <span>
                Max wait time: {selectedChain?.maxWaitTime! / 3600}{' '}
                hours
              </span>
              <Tooltip content="Maximum time to wait for the transaction to be included on L2">
                <button className="focus:outline-none">
                  <BsQuestionCircle
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    size={14}
                  />
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Compose Transaction Data</ModalHeader>
          <ModalBody>
            <SmartModeInput
              to={to as Address}
              selectedChainId={l2ChainId}
              onDataGenerated={handleDataGenerated}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AddNetworkModal
        isOpen={isAddNetworkOpen}
        onClose={() => setIsAddNetworkOpen(false)}
        onSubmit={handleAddNetwork}
      />
    </div>
  );
};

export default ForceInclusionCard;
