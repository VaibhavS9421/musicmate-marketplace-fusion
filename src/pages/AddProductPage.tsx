
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SellerBottomNav from '@/components/SellerBottomNav';
import BackButton from '@/components/seller/BackButton';
import ProductForm from '@/components/seller/ProductForm';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="app-container pb-16">
      <div className="page-container">
        <BackButton onClick={handleBack} />
        <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>
        <ProductForm onBack={handleBack} />
      </div>
      <SellerBottomNav />
    </div>
  );
};

export default AddProductPage;
