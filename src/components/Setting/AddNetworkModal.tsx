'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Tooltip,
} from '@nextui-org/react';
import { addCustomNetwork, updateCustomNetwork } from '@/config/customNetworks';
import { ChainConfig } from '@/config/chainConfig';
import { BsQuestionCircle } from 'react-icons/bs';
import { inter } from '@/config/fonts';

interface AddNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  editNetwork?: ChainConfig;
  onSubmitCallback?: () => void;
}

const tooltips = {
  name: <div className="text-sm p-4">
    The name for the chain
  </div>,
  chainId: <div className="text-sm p-4">
    <p>Find your chain ID on <a href="https://chainlist.org/" target="_blank" rel="noopener noreferrer" className="text-primary">chainlist.org</a></p>
  </div>,
  rpcUrl: <div className="text-sm p-4">
    The HTTP endpoint used to interact with your chain.
  </div>,
  portalProxy: <div className="text-sm p-4 space-y-2">
    <p>The OptimismPortalProxy contract address on L1.</p>
    <p>To find it:</p>
    <ul className="list-disc pl-4 space-y-1">
      <li>Visit <a href="https://l2beat.com/" target="_blank" rel="noopener noreferrer" className="text-primary">l2beat.com</a></li>
      <li>Find and click on the chain you want to add</li>
      <li>Go to <span className="font-medium">Smart contracts</span> section</li>
      <li>Look for the OptimismPortal address</li>
    </ul>
  </div>,
};

export const AddNetworkModal = ({
  isOpen,
  onClose,
  editNetwork,
  onSubmitCallback,
}: AddNetworkModalProps) => {
  const [name, setName] = useState('');
  const [chainId, setChainId] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [optimismPortalAddress, setOptimismPortalAddress] = useState('');

  useEffect(() => {
    if (editNetwork) {
      setName(editNetwork.name);
      setChainId(editNetwork.chainId.toString());
      setRpcUrl(editNetwork.rpcUrl as string);
      setOptimismPortalAddress(editNetwork.optimismPortalAddress);
    } else {
      setName('');
      setChainId('');
      setRpcUrl('');
      setOptimismPortalAddress('');
    }
  }, [isOpen, editNetwork]);

  const handleSubmit = () => {
    const network = {
      name,
      chainId: parseInt(chainId),
      rpcUrl,
      optimismPortalAddress: optimismPortalAddress as `0x${string}`,
      isOpstack: true,
    };

    if (editNetwork) {
      updateCustomNetwork(editNetwork.chainId, network);
    } else {
      addCustomNetwork(network.chainId, network);
    }
    
    onClose();

    if (onSubmitCallback) {
      onSubmitCallback();
    }
  };

  const isValid = name && chainId && rpcUrl && optimismPortalAddress;

  if (!isOpen) return null;

  return (
    <div className={inter.className}>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <Card className="w-full max-w-lg mx-4 px-4">
          <CardHeader className="flex flex-col gap-1 border-b border-divider">
            <p className="text-xl py-2">{editNetwork ? 'Edit Network' : 'Add Network'}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-default-500">Tech Stack:</span>
              <span className="text-sm">OP Stack</span>
            </div>
          </CardHeader>
          <CardBody className="gap-6 py-6">
            {/* Network Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-sm">Network Name</div>
                <Tooltip content={tooltips.name} placement="right">
                  <button type="button" className="focus:outline-none">
                    <BsQuestionCircle className="text-gray-400 hover:text-gray-600 transition-colors" size={14} />
                  </button>
                </Tooltip>
              </div>
              <Input
                value={name}
                onValueChange={setName}
                placeholder="e.g., Optimism"
              />
            </div>

            {/* Chain ID */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-sm">Chain ID</div>
                <Tooltip content={tooltips.chainId} placement="right">
                  <button type="button" className="focus:outline-none">
                    <BsQuestionCircle className="text-gray-400 hover:text-gray-600 transition-colors" size={14} />
                  </button>
                </Tooltip>
              </div>
              <Input
                value={chainId}
                onValueChange={setChainId}
                placeholder="e.g., 10"
                disabled={!!editNetwork}
              />
            </div>

            {/* RPC URL */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-sm">RPC URL</div>
                <Tooltip content={tooltips.rpcUrl} placement="right">
                  <button type="button" className="focus:outline-none">
                    <BsQuestionCircle className="text-gray-400 hover:text-gray-600 transition-colors" size={14} />
                  </button>
                </Tooltip>
              </div>
              <Input
                value={rpcUrl}
                onValueChange={setRpcUrl}
                placeholder="e.g., https://mainnet.optimism.io"
              />
            </div>

            {/* Portal Proxy */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-sm">Optimism Portal Proxy Address</div>
                <Tooltip content={tooltips.portalProxy} placement="right">
                  <button type="button" className="focus:outline-none">
                    <BsQuestionCircle className="text-gray-400 hover:text-gray-600 transition-colors" size={14} />
                  </button>
                </Tooltip>
              </div>
              <Input
                value={optimismPortalAddress}
                onValueChange={setOptimismPortalAddress}
                placeholder="e.g., 0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
              />
            </div>
          </CardBody>
          <CardFooter className="justify-end gap-2 border-t border-divider">
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSubmit} isDisabled={!isValid}>
              {editNetwork ? 'Update' : 'Add'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default AddNetworkModal;
