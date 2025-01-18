import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';

interface AddNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (networkData: {
    name: string;
    chainId: number;
    optimismPortalAddress: string;
    rpcUrl: string;
  }) => void;
}

const AddNetworkModal: React.FC<AddNetworkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    chainId: '',
    optimismPortalAddress: '',
    rpcUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      chainId: parseInt(formData.chainId),
    });
    setFormData({
      name: '',
      chainId: '',
      optimismPortalAddress: '',
      rpcUrl: '',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="font-normal text-2xl pt-4">
            Add Network
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Network Name"
                placeholder="e.g., Optimism"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Input
                label="Chain ID"
                placeholder="e.g., 10"
                type="number"
                value={formData.chainId}
                onChange={(e) =>
                  setFormData({ ...formData, chainId: e.target.value })
                }
                required
              />
              <div className="flex items-center gap-2 px-1">
                <span className="text-sm text-default-500">Tech Stack:</span>
                <span className="text-sm">OP Stack</span>
              </div>
              <Input
                label="Portal Proxy Address"
                placeholder="e.g., 0x..."
                value={formData.optimismPortalAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    optimismPortalAddress: e.target.value,
                  })
                }
                required
              />
              <Input
                label="RPC URL"
                placeholder="e.g., https://mainnet.optimism.io"
                value={formData.rpcUrl}
                onChange={(e) =>
                  setFormData({ ...formData, rpcUrl: e.target.value })
                }
                required
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Add Network
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddNetworkModal;
