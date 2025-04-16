
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import SellerBottomNav from '@/components/SellerBottomNav';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  image_url: string;
}

const SellerHomePage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Not authenticated",
          description: "Please log in to view your products.",
        });
        navigate('/login');
        return;
      }
      
      const sellerId = session.user.id;
      
      // Fetch products for the current seller
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId);
        
      if (error) throw error;
      
      if (data) {
        const formattedProducts = data.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.image_url,
          image_url: product.image_url
        }));
        
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Failed to load products",
        description: "There was an error loading your products. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [navigate, toast]);
  
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredProducts(filtered);
    
    if (filtered.length === 0) {
      toast({
        title: "No results found",
        description: `No products match "${query}"`,
      });
    }
  };

  const handleRemoveProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      
      toast({
        title: "Product removed",
        description: "The product has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing product:', error);
      toast({
        variant: "destructive",
        title: "Failed to remove product",
        description: "There was an error removing your product.",
      });
    }
  };

  const handleAddProduct = () => {
    navigate('/seller/add-product');
  };

  return (
    <div className="app-container pb-16">
      <div className="page-container">
        <header className="py-4">
          <h1 className="text-2xl font-bold mb-4">
            <span className="text-music-red">Music</span>
            <span className="text-mate-black">Mate</span> <span className="text-sm font-normal">(Seller)</span>
          </h1>
          <SearchBar onSearch={handleSearch} placeholder="Search your products..." />
        </header>
        
        <main>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-500">Loading your products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-500 mb-4">You don't have any products yet</p>
              <Button 
                onClick={handleAddProduct}
                className="bg-music-red hover:bg-red-600"
              >
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="flex items-center">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="flex-grow p-3">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-base">{product.name}</h3>
                          <p className="font-bold">₹{product.price.toLocaleString()}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
      <SellerBottomNav />
    </div>
  );
};

export default SellerHomePage;
