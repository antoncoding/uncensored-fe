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
    <div className="flex justify-center items-center min-h-screen w-full">
      <Card className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl mb-4 text-center">Settings</h1>
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
      </Card>
    </div>
  );
};

export default Settings;
