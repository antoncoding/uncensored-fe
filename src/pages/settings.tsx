import React, { useState, useEffect } from 'react';
import { Card, Switch } from '@nextui-org/react';

const Settings = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Card className="bg-card p-8 shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="mb-6">
        <h2 className="text-lg mb-2">Theme</h2>
        <Switch
          isSelected={theme === 'dark'}
          onChange={toggleTheme}
          color="primary"
          size="sm"
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </Switch>
      </div>
      {/* Future settings sections can be added here */}

      <div className="mb-6">
        <h2 className="text-lg mb-2">RPC Providers</h2>
        <p className="text-sm text-gray-500 mb-2">Coming soon...</p>
      </div>
    </Card>
  );
};

export default Settings;
