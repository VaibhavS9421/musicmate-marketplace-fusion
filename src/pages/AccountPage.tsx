
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUserRole } from '../contexts/UserRoleContext';
import BuyerBottomNav from '@/components/BuyerBottomNav';
import SellerBottomNav from '@/components/SellerBottomNav';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useUserRole();
  
  const name = localStorage.getItem('userName') || 'User';
  const email = localStorage.getItem('userEmail') || 'user@example.com';
  const mobile = localStorage.getItem('userMobile') || '9123456789';
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userMobile');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    
    navigate('/role-selection');
  };

  return (
    <div className="app-container pb-16">
      <div className="page-container">
        <h1 className="text-2xl font-semibold py-4">Account</h1>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-medium mb-1">{name}</h2>
          <p className="text-gray-600 mb-1">{email}</p>
          <p className="text-gray-600 mb-1">{mobile}</p>
          <p className="text-sm text-music-red font-medium">{userRole === 'buyer' ? 'Buyer Account' : 'Seller Account'}</p>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start text-left h-12"
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "This feature will be available in a future update.",
              });
            }}
          >
            Profile Settings
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start text-left h-12"
            onClick={() => navigate('/orders')}
          >
            My Orders
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start text-left h-12"
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "This feature will be available in a future update.",
              });
            }}
          >
            Help & Support
          </Button>
        </div>
        
        <Button
          variant="destructive"
          className="w-full mt-8"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      
      {userRole === 'buyer' ? <BuyerBottomNav /> : <SellerBottomNav />}
    </div>
  );
};

export default AccountPage;
