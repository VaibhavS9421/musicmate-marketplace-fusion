
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SellerBottomNav from '@/components/SellerBottomNav';
import BackButton from '@/components/seller/BackButton';
import { CreateProductForm } from '@/components/seller/CreateProductForm';

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
      </div>
      <SellerBottomNav />
    </div>
  );
};

export default AddProductPage;
