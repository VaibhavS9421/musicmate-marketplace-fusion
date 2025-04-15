
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, ArrowLeft } from 'lucide-react';
import SellerBottomNav from '@/components/SellerBottomNav';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [upiImage, setUpiImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };
  
  const handleUpiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUpiImage(e.target.files[0]);
    }
  };
  
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
      // Simulate API call to add a new product
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Product added",
        description: "Your product has been added successfully!",
      });
      
      navigate('/seller/home');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add product",
        description: "There was an error adding your product.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="app-container pb-16">
      <div className="page-container">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 py-4"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>
        
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
          
          <div>
            <Label className="block mb-2">Upload Product Image</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-music-red hover:text-red-500">
                    <span>Upload a file</span>
                    <input 
                      id="product-upload" 
                      name="product-upload" 
                      type="file" 
                      className="sr-only"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                {productImage && (
                  <p className="text-sm text-green-600">{productImage.name}</p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <Label className="block mb-2">Upload UPI QR Code</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-music-red hover:text-red-500">
                    <span>Upload a file</span>
                    <input 
                      id="upi-upload" 
                      name="upi-upload" 
                      type="file" 
                      className="sr-only"
                      accept="image/*"
                      onChange={handleUpiImageUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                {upiImage && (
                  <p className="text-sm text-green-600">{upiImage.name}</p>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-music-red hover:bg-red-600 mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Adding Product..." : "Add Product"}
          </Button>
        </form>
      </div>
      <SellerBottomNav />
    </div>
  );
};

export default AddProductPage;
