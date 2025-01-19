import React, { useState, useEffect } from 'react';
import { Card, Switch } from '@nextui-org/react';
import storage from 'local-storage-fallback';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  
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
    </Card>
  );
};

export default Settings;
