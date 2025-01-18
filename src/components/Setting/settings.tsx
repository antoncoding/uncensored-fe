import React, { useState, useEffect } from 'react';
import { Card, Switch, Button } from '@nextui-org/react';
import AddNetworkModal from './AddNetworkModal';
import { toast } from 'react-toastify';
import { addCustomNetwork } from '@/config/customNetworks';
import storage from 'local-storage-fallback';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [isAddNetworkOpen, setIsAddNetworkOpen] = useState(false);

  useEffect(() => {
    const savedTheme = storage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    storage.setItem('theme', newTheme);
  };

  const handleAddNetwork = (networkData: {
    name: string;
    chainId: number;
    optimismPortalAddress: string;
    rpcUrl: string;
  }) => {
    const completeConfig = {
      ...networkData,
      optimismPortalAddress: networkData.optimismPortalAddress as `0x${string}`,
      isOpstack: true,
      maxWaitTime: 12 * 3600, // 12 hours
    };

    addCustomNetwork(networkData.chainId, completeConfig);
    toast.success('Network added successfully!');
  };

  return (
    <Card className="bg-card p-8 w-full max-w-lg shadow-none">
      <h2 className="text-2xl mb-4">Settings</h2>
      <div className="mb-6">
        <h2 className="text mb-2">Theme</h2>
        <Switch
          isSelected={theme === 'dark'}
          onChange={toggleTheme}
          color="primary"
          size="sm"
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </Switch>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text">Add Network</h2>
          <Button
            size="sm"
            color="primary"
            variant="light"
            onPress={() => setIsAddNetworkOpen(true)}
          >
            Add New
          </Button>
        </div>
      </div>

      <AddNetworkModal
        isOpen={isAddNetworkOpen}
        onClose={() => setIsAddNetworkOpen(false)}
        onSubmit={handleAddNetwork}
      />
    </Card>
  );
};

export default Settings;
