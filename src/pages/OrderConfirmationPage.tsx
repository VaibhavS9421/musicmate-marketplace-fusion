
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface OrderDetails {
  orderId: number;
  productName: string;
  productPrice: number;
  imageUrl: string;
}

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state as OrderDetails;
  
  // If no state is passed, generate random ID for demo purposes
  const orderId = orderDetails?.orderId || Math.floor(100000 + Math.random() * 900000);
  const productName = orderDetails?.productName || "Instrument";
  const productPrice = orderDetails?.productPrice || 0;
  const imageUrl = orderDetails?.imageUrl || "https://placehold.co/400";
  
  const handleGoToOrders = () => {
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
        <p className="text-gray-600 mb-4">
          Your order #{orderId} has been successfully placed.
          We'll notify you once the seller confirms your order.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 flex-shrink-0">
              <img 
                src={imageUrl} 
                alt={productName} 
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="ml-4 text-left">
              <h2 className="font-medium">{productName}</h2>
              <p className="text-xl font-bold text-music-red">₹{productPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleGoToOrders}
          className="w-full bg-music-red hover:bg-red-600 mb-2"
        >
          View My Orders
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
