
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, ShoppingBag } from 'lucide-react';

const BuyerBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bottom-nav">
      <div 
        className={`flex flex-col items-center ${isActive('/buyer/home') ? 'text-music-red font-medium' : 'text-gray-500'}`}
        onClick={() => navigate('/buyer/home')}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </div>
      <div 
        className={`flex flex-col items-center ${isActive('/account') ? 'text-music-red font-medium' : 'text-gray-500'}`}
        onClick={() => navigate('/account')}
      >
        <User size={24} />
        <span className="text-xs mt-1">Account</span>
      </div>
      <div 
        className={`flex flex-col items-center ${isActive('/orders') ? 'text-music-red font-medium' : 'text-gray-500'}`}
        onClick={() => navigate('/orders')}
      >
        <ShoppingBag size={24} />
        <span className="text-xs mt-1">Orders</span>
      </div>
    </div>
  );
};

export default BuyerBottomNav;
