
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useUserRole } from '../contexts/UserRoleContext';
import BuyerBottomNav from '@/components/BuyerBottomNav';
import SellerBottomNav from '@/components/SellerBottomNav';

interface Order {
  id: string;
  productName: string;
  price: number;
  orderDate: string;
  status: string;
  imageUrl: string;
  sellerId?: string;
  buyerName?: string;
  buyerAddress?: string;
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // Load orders from localStorage based on user role
    const storedOrders = userRole === 'buyer' 
      ? JSON.parse(localStorage.getItem('buyerOrders') || '[]')
      : JSON.parse(localStorage.getItem('sellerOrders') || '[]');
    
    setOrders(storedOrders);
  }, [userRole]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="app-container pb-16">
      <div className="page-container">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 py-4"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl font-semibold mb-6">
          {userRole === 'buyer' ? 'My Orders' : 'Customer Orders'}
        </h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={order.imageUrl} 
                      alt={order.productName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-grow p-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-base">{order.productName}</h3>
                        <p className="font-bold">₹{order.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Order #{order.id} • {order.orderDate}</p>
                        {userRole === 'seller' && order.buyerName && (
                          <>
                            <p className="text-xs text-gray-600">Buyer: {order.buyerName}</p>
                            {order.buyerAddress && (
                              <p className="text-xs text-gray-600 mt-1">Address: {order.buyerAddress}</p>
                            )}
                          </>
                        )}
                      </div>
                      <Badge className={`${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {userRole === 'buyer' ? <BuyerBottomNav /> : <SellerBottomNav />}
    </div>
  );
};

export default OrdersPage;
