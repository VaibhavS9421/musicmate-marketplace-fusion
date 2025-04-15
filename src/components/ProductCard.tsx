
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  sellerId: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, imageUrl, sellerId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer mb-4"
      onClick={handleClick}
    >
      <div className="aspect-square w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-base truncate">{name}</h3>
        <p className="font-bold text-lg">₹{price.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
