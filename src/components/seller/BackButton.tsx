
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, label = "Back" }) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center text-gray-600 py-4"
    >
      <ArrowLeft size={20} className="mr-1" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
