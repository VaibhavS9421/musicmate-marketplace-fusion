
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from './ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useFileUpload } from '@/hooks/useFileUpload';

// Define schema for product form
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.string().min(1, 'Price is required'),
  description: z.string().min(1, 'Description is required'),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface CreateProductFormProps {
  onSuccess?: () => void;
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addProduct } = useProducts();
  const { fileToBase64 } = useFileUpload();
  const [productImage, setProductImage] = useState<File | null>(null);
  const [upiImage, setUpiImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: '',
      description: '',
    },
  });

  // Check authentication on component mount
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to add products.",
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  const onSubmit = async (values: ProductFormValues) => {
    if (!productImage || !upiImage) {
      toast({
        variant: "destructive",
        title: "Missing images",
        description: "Please upload both product image and UPI QR code.",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to add products.",
      });
      navigate('/login');
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert images to base64
      const productImageBase64 = await fileToBase64(productImage);
      const upiImageBase64 = await fileToBase64(upiImage);
      
      // Add product to context
      addProduct({
        name: values.name,
        price: parseInt(values.price),
        description: values.description,
        imageUrl: productImageBase64,
        upiQrUrl: upiImageBase64,
        sellerId: user.id
      });
      
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/seller/home');
      }
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
    <Form {...form}>
      <form 
        id="create-product-form"
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (₹)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter product description" 
                  rows={3} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
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
        </div>
      </form>
    </Form>
  );
};
