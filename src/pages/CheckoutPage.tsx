
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  image_url: string;
  sellerId: string;
  seller_id: string;
  upi_qr_url: string;
}

const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showUpiQr, setShowUpiQr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoadingProduct(true);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setProduct({
            id: data.id,
            name: data.name,
            price: data.price,
            imageUrl: data.image_url,
            image_url: data.image_url,
            sellerId: data.seller_id,
            seller_id: data.seller_id,
            upi_qr_url: data.upi_qr_url
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          variant: "destructive",
          title: "Failed to load product",
          description: "There was an error loading the product. Please try again later.",
        });
      } finally {
        setIsLoadingProduct(false);
      }
    };
    
    fetchProduct();
  }, [id, toast]);
  
  if (isLoadingProduct) {
    return (
      <div className="app-container pb-24">
        <div className="page-container flex items-center justify-center min-h-screen">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button 
            onClick={() => navigate('/buyer/home')}
            className="bg-music-red hover:bg-red-600"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleProceedToPayment = () => {
    if (!address) {
      toast({
        variant: "destructive",
        title: "Address required",
        description: "Please enter your delivery address to continue.",
      });
      return;
    }
    
    if (paymentMethod === 'upi') {
      setShowUpiQr(true);
    } else {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authenticated session');
      }
      
      const buyerId = session.user.id;
      
      // Create order
      const { error } = await supabase
        .from('orders')
        .insert({
          product_id: product.id,
          buyer_id: buyerId,
          seller_id: product.seller_id,
          payment_method: paymentMethod,
          total_amount: product.price,
          address: address,
          status: 'pending'
        });
        
      if (error) throw error;
      
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        variant: "destructive",
        title: "Failed to place order",
        description: "There was an error processing your order.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container pb-24">
      <div className="page-container">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 py-4"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
        
        {!showUpiQr ? (
          <>
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <div className="flex items-center">
                <div className="w-20 h-20 flex-shrink-0">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="ml-4">
                  <h2 className="font-medium">{product.name}</h2>
                  <p className="text-xl font-bold text-music-red">₹{product.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Delivery Address</h2>
              <Textarea
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi">UPI Payment</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold">₹{product.price.toLocaleString()}</span>
              </div>
              <Button 
                onClick={handleProceedToPayment}
                className="w-full h-12 bg-music-red hover:bg-red-600 text-lg"
              >
                {paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-medium mb-4">Scan to Pay</h2>
            <div className="w-64 h-64 mb-6">
              <img 
                src={product.upi_qr_url}
                alt="UPI QR Code" 
                className="w-full h-full object-contain border p-2"
              />
            </div>
            <p className="text-gray-600 mb-4 text-center">
              Scan this QR code with any UPI app to complete your payment of ₹{product.price.toLocaleString()}
            </p>
            <Button 
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 hover:bg-green-700 mb-2"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "I've Made the Payment"}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowUpiQr(false)}
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
