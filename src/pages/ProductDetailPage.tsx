
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getProduct } from '@/utils/localStorage';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const product = id ? getProduct(id) : null;

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

  const handleBuy = () => {
    navigate(`/checkout/${product.id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="app-container">
      <div className="page-container pb-24">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 py-4"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
        
        <div className="w-full aspect-square overflow-hidden mb-4">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h1 className="text-2xl font-semibold mt-4">{product.name}</h1>
        <p className="text-3xl font-bold text-music-red mt-2">₹{product.price.toLocaleString()}</p>
        
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Product Details</h2>
          <p className="text-gray-700">{product.description}</p>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <Button 
            onClick={handleBuy}
            className="w-full h-12 bg-music-red hover:bg-red-600 text-lg"
          >
            Buy Instrument
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
