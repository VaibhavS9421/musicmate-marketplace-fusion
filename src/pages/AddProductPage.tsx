
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SellerBottomNav from '@/components/SellerBottomNav';
import BackButton from '@/components/seller/BackButton';
import ProductForm from '@/components/seller/ProductForm';
import { Button } from '@/components/ui/button';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmitClick = () => {
    // Find the form and submit it programmatically
    const form = document.querySelector('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <div className="app-container pb-16">
      <div className="page-container">
        <div className="flex justify-between items-center mb-4">
          <BackButton onClick={handleBack} />
          <Button 
            onClick={handleSubmitClick}
            className="bg-music-red hover:bg-red-600"
          >
            Submit Product
          </Button>
        </div>
        <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>
        <ProductForm onBack={handleBack} />
      </div>
      <SellerBottomNav />
    </div>
  );
};

export default AddProductPage;
