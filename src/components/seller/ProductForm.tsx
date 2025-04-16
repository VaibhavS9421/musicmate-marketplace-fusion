
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  onBack: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [upiImage, setUpiImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !description || !productImage || !upiImage) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all the fields and upload all required images.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authenticated session');
      }
      
      const sellerId = session.user.id;
      const productImageName = `${uuidv4()}-${productImage.name}`;
      const upiImageName = `${uuidv4()}-${upiImage.name}`;
      
      // Upload product image
      const { error: productImageError } = await supabase.storage
        .from('product_images')
        .upload(productImageName, productImage);
        
      if (productImageError) throw productImageError;
      
      // Upload UPI QR image
      const { error: upiImageError } = await supabase.storage
        .from('product_images')
        .upload(upiImageName, upiImage);
        
      if (upiImageError) throw upiImageError;
      
      // Get the public URLs for the uploaded images
      const productImageUrl = supabase.storage
        .from('product_images')
        .getPublicUrl(productImageName).data.publicUrl;
        
      const upiQrUrl = supabase.storage
        .from('product_images')
        .getPublicUrl(upiImageName).data.publicUrl;
      
      // Insert product data into the database
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          name,
          price: parseInt(price),
          description,
          image_url: productImageUrl,
          upi_qr_url: upiQrUrl,
          seller_id: sellerId
        });
        
      if (insertError) throw insertError;
      
      toast({
        title: "Product added",
        description: "Your product has been added successfully!",
      });
      
      navigate('/seller/home');
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Failed to add product",
        description: error instanceof Error ? error.message : "There was an error adding your product.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="price">Price (₹)</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price in rupees"
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          className="w-full"
          rows={3}
        />
      </div>
      
      <ImageUpload
        label="Upload Product Image"
        id="product-upload"
        file={productImage}
        onChange={(file) => setProductImage(file)}
      />
      
      <ImageUpload
        label="Upload UPI QR Code"
        id="upi-upload"
        file={upiImage}
        onChange={(file) => setUpiImage(file)}
      />
      
      <Button 
        type="submit" 
        className="w-full bg-music-red hover:bg-red-600 mt-6"
        disabled={isLoading}
      >
        {isLoading ? "Adding Product..." : "Add Product"}
      </Button>
    </form>
  );
};

export default ProductForm;
