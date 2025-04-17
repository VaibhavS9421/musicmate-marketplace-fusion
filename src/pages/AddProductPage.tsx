
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SellerBottomNav from '@/components/SellerBottomNav';
import BackButton from '@/components/seller/BackButton';
import { CreateProductForm } from '@/components/seller/CreateProductForm';
import { Button } from '@/components/ui/button';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="app-container pb-16">
      <div className="page-container">
        <div className="flex justify-between items-center mb-4">
          <BackButton onClick={handleBack} />
        </div>
        <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>
        <CreateProductForm />
        <div className="mt-4">
          <Button 
            type="submit" 
            form="create-product-form" 
            className="w-full bg-music-red hover:bg-red-600"
          >
            Submit Product
          </Button>
        </div>
      </div>
      <SellerBottomNav />
    </div>
  );
};

export default AddProductPage;
