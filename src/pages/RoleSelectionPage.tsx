
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserRole } from '../contexts/UserRoleContext';

const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole } = useUserRole();

  const handleRoleSelection = (role: 'buyer' | 'seller') => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="logo-text text-4xl mb-12">
        <span className="text-music-red">Music</span>
        <span className="text-mate-black">Mate</span>
      </h1>
      
      <div className="text-center mb-10 fade-in">
        <h2 className="text-2xl font-semibold mb-2">What would you like to do?</h2>
        <p className="text-gray-600">Select your role to continue</p>
      </div>
      
      <div className="w-full max-w-xs space-y-4">
        <Button 
          onClick={() => handleRoleSelection('buyer')}
          className="w-full h-14 text-lg bg-music-red hover:bg-red-600 fade-in-delay-1"
          variant="default"
        >
          Buy Instruments
        </Button>
        
        <Button 
          onClick={() => handleRoleSelection('seller')}
          className="w-full h-14 text-lg bg-mate-black hover:bg-gray-800 fade-in-delay-2"
          variant="default"
        >
          Sell Instruments
        </Button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
