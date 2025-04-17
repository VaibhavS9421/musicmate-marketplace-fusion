
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SellerBottomNav from '@/components/SellerBottomNav';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';

const SellerHomePage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { products, removeProduct } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Not authenticated",
        description: "Please log in to view your products.",
      });
      navigate('/login');
    } else {
      // Filter products by seller ID
      const sellerProducts = products.filter(product => product.sellerId === user?.id);
      setFilteredProducts(sellerProducts);
    }
  }, [isAuthenticated, navigate, products, toast, user?.id]);
  
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      const sellerProducts = products.filter(product => product.sellerId === user?.id);
      setFilteredProducts(sellerProducts);
      return;
    }
    
    const filtered = products
      .filter(product => product.sellerId === user?.id)
      .filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
    
    setFilteredProducts(filtered);
    
    if (filtered.length === 0) {
      toast({
        title: "No results found",
        description: `No products match "${query}"`,
      });
    }
  };

  const handleRemoveProduct = (id: string) => {
    try {
      removeProduct(id);
      
      // Update filtered products
      setFilteredProducts(prev => prev.filter(product => product.id !== id));
      
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
                        src={product.imageUrl} 
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
