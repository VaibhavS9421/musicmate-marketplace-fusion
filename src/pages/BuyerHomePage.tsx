
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import BuyerBottomNav from '@/components/BuyerBottomNav';
import ProductCard from '@/components/ProductCard';
import { useToast } from '@/components/ui/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  image_url?: string;
  sellerId: string;
  seller_id?: string;
}

const BuyerHomePage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load only seller-added products from localStorage
    const loadProducts = () => {
      try {
        setIsLoading(true);
        // Get products added by sellers from localStorage
        const sellerAddedProducts = JSON.parse(localStorage.getItem('products') || '[]');
        
        setProducts(sellerAddedProducts);
        setFilteredProducts(sellerAddedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          variant: "destructive",
          title: "Failed to load products",
          description: "There was an error loading the products. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [toast]);
  
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

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="app-container pb-16">
      <div className="page-container">
        <header className="py-4">
          <h1 className="text-2xl font-bold mb-4">
            <span className="text-music-red">Music</span>
            <span className="text-mate-black">Mate</span>
          </h1>
          <SearchBar onSearch={handleSearch} />
        </header>
        
        <main>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-500">No products available</p>
              <p className="text-sm text-gray-400 mt-2">Check back later when sellers have added products</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl || product.image_url || ''}
                  sellerId={product.sellerId || product.seller_id || ''}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      <BuyerBottomNav />
    </div>
  );
};

export default BuyerHomePage;
