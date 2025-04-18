
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const orderId = Math.floor(100000 + Math.random() * 900000); // Generate random order ID
  
  const handleViewOrders = () => {
    navigate('/orders');
  };
  
  const handleContinueShopping = () => {
    navigate('/buyer/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
        <p className="text-gray-600 mb-6">
          Your order #{orderId} has been successfully placed.
          We'll notify you once the seller confirms your order.
        </p>
        
        <Button 
          onClick={handleViewOrders}
          className="w-full bg-music-red hover:bg-red-600 mb-2"
        >
          View Order Details
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleContinueShopping}
          className="w-full"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
