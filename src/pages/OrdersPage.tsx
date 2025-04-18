
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useUserRole } from '../contexts/UserRoleContext';
import BuyerBottomNav from '@/components/BuyerBottomNav';
import SellerBottomNav from '@/components/SellerBottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Order {
  id: string;
  total_amount: number;
  order_date: string;
  status: string;
  address: string;
  payment_method: string;
  buyer_id?: string;
  product: {
    name: string;
    image_url: string;
  };
  buyer_name?: string;
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }
        
        const userId = session.user.id;
        
        // Fetch orders based on user role
        const query = supabase
          .from('orders')
          .select(`
            *,
            product: products (
              name,
              image_url
            )
          `);
          
        // Filter based on user role
        const filteredQuery = userRole === 'buyer'
          ? query.eq('buyer_id', userId)
          : query.eq('seller_id', userId);
          
        const { data, error } = await filteredQuery;
        
        if (error) throw error;
        
        if (data) {
          // For each order, try to get the buyer's name separately if this is a seller viewing orders
          const ordersWithBuyerInfo = await Promise.all(
            data.map(async (order) => {
              // Only fetch buyer info if user is a seller
              if (userRole === 'seller') {
                const { data: buyerData, error: buyerError } = await supabase
                  .from('profiles')
                  .select('name')
                  .eq('id', order.buyer_id)
                  .single();
                
                if (!buyerError && buyerData) {
                  return { 
                    ...order, 
                    buyer_name: buyerData.name 
                  };
                }
              }
              return order;
            })
          );
          
          setOrders(ordersWithBuyerInfo as Order[]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          variant: "destructive",
          title: "Failed to load orders",
          description: "There was an error loading the orders. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [navigate, userRole, toast]);
  
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
        
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
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
                      src={order.product.image_url} 
                      alt={order.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-grow p-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-base">{order.product.name}</h3>
                        <p className="font-bold">₹{order.total_amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                          Order #{order.id.slice(0, 8)} • {new Date(order.order_date).toLocaleDateString()}
                        </p>
                        {userRole === 'seller' && order.buyer_name && (
                          <p className="text-xs text-gray-600">Buyer: {order.buyer_name}</p>
                        )}
                        <p className="text-xs text-gray-600">Payment: {order.payment_method}</p>
                        <p className="text-xs text-gray-600 truncate max-w-[200px]">
                          Address: {order.address}
                        </p>
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
