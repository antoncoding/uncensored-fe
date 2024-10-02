import React from 'react';
import Settings from '../pages/settings';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg relative w-full max-w-lg mx-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 rounded-full w-8 h-8 flex items-center justify-center z-10 transition-colors duration-200"
        >
          ✕
        </button>
        <div className="relative p-4">
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
