
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/seller/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import SellerBottomNav from '@/components/SellerBottomNav';
import { User, Package, MapPin, CreditCard } from 'lucide-react';

interface OrderDetails {
  id: string;
  status: string;
  total_amount: number;
  order_date: string;
  payment_method: string;
  address: string;
  product: {
    name: string;
    image_url: string;
  };
  buyer: {
    name: string;
    email: string;
    mobile: string;
  };
}

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        
        if (!orderId) {
          toast({
            variant: "destructive",
            title: "Invalid order ID",
            description: "No order ID was provided.",
          });
          return;
        }

        console.log("Fetching order with ID:", orderId);
        
        // Use maybeSingle() instead of single() to avoid PGRST116 error
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            id,
            status,
            total_amount,
            order_date,
            payment_method,
            address,
            buyer_id,
            product_id,
            product:products (
              name,
              image_url
            )
          `)
          .eq('id', orderId)
          .maybeSingle();

        if (orderError) {
          console.error("Order fetch error:", orderError);
          throw orderError;
        }

        if (!orderData) {
          toast({
            variant: "destructive",
            title: "Order not found",
            description: "The requested order could not be found.",
          });
          return;
        }

        console.log("Order data fetched:", orderData);

        // Fetch buyer details
        const { data: buyerData, error: buyerError } = await supabase
          .from('profiles')
          .select('name, email, mobile')
          .eq('id', orderData.buyer_id)
          .maybeSingle();

        if (buyerError) {
          console.error("Buyer fetch error:", buyerError);
          toast({
            variant: "destructive",
            title: "Error fetching buyer details",
            description: "There was a problem retrieving buyer information.",
          });
          // Continue with partial data
        }

        // Set default values for missing buyer information
        const buyerInfo = {
          name: buyerData?.name || 'Not available',
          email: buyerData?.email || 'Not available',
          mobile: buyerData?.mobile || 'Not available'
        };

        setOrderDetails({
          ...orderData,
          buyer: buyerInfo
        } as OrderDetails);
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast({
          variant: "destructive",
          title: "Failed to load order details",
          description: "There was an error loading the order details. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, toast]);

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

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="page-container">
          <BackButton onClick={() => navigate(-1)} />
          <div className="text-center py-10">
            <p className="text-gray-500">Loading order details...</p>
          </div>
        </div>
        <SellerBottomNav />
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="app-container">
        <div className="page-container">
          <BackButton onClick={() => navigate(-1)} />
          <div className="text-center py-10">
            <p className="text-gray-500">Order not found</p>
          </div>
        </div>
        <SellerBottomNav />
      </div>
    );
  }

  return (
    <div className="app-container pb-16">
      <div className="page-container">
        <BackButton onClick={() => navigate(-1)} />
        
        <h1 className="text-2xl font-semibold mb-6">Order Details</h1>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 flex-shrink-0">
                <img 
                  src={orderDetails.product.image_url} 
                  alt={orderDetails.product.name} 
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-medium text-lg">{orderDetails.product.name}</h2>
                    <p className="font-bold text-lg">₹{orderDetails.total_amount.toLocaleString()}</p>
                  </div>
                  <Badge className={`${getStatusColor(orderDetails.status)}`}>
                    {orderDetails.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Order #{orderDetails.id.slice(0, 8)} • {new Date(orderDetails.order_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="w-5 h-5 mr-2 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Buyer Details</p>
                  <p className="font-medium">{orderDetails.buyer.name}</p>
                  <p className="text-sm">{orderDetails.buyer.email}</p>
                  <p className="text-sm">{orderDetails.buyer.mobile}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-medium">{orderDetails.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <CreditCard className="w-5 h-5 mr-2 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{orderDetails.payment_method}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <SellerBottomNav />
    </div>
  );
};

export default OrderDetailPage;
