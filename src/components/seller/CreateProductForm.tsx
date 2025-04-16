
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from './ImageUpload';

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
  const [productImage, setProductImage] = React.useState<File | null>(null);
  const [upiImage, setUpiImage] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

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
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to add products.",
        });
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const onSubmit = async (values: ProductFormValues) => {
    if (!productImage || !upiImage) {
      toast({
        variant: "destructive",
        title: "Missing images",
        description: "Please upload both product image and UPI QR code.",
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
      
      console.log("Uploading images to storage bucket...");
      // Create storage bucket if it doesn't exist
      try {
        // Upload product image
        const { error: productImageError } = await supabase.storage
          .from('product_images')
          .upload(productImageName, productImage);
          
        if (productImageError) {
          console.error("Product image error:", productImageError);
          throw productImageError;
        }
        
        // Upload UPI QR image
        const { error: upiImageError } = await supabase.storage
          .from('product_images')
          .upload(upiImageName, upiImage);
          
        if (upiImageError) {
          console.error("UPI image error:", upiImageError);
          throw upiImageError;
        }
      } catch (error: any) {
        if (error.message.includes('The resource already exists')) {
          console.log('Bucket already exists, continuing...');
        } else {
          throw error;
        }
      }
      
      // Get the public URLs for the uploaded images
      const productImageUrl = supabase.storage
        .from('product_images')
        .getPublicUrl(productImageName).data.publicUrl;
        
      const upiQrUrl = supabase.storage
        .from('product_images')
        .getPublicUrl(upiImageName).data.publicUrl;
      
      console.log("Inserting product with seller ID:", sellerId);
      // Insert product data into the database
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          name: values.name,
          price: parseInt(values.price),
          description: values.description,
          image_url: productImageUrl,
          upi_qr_url: upiQrUrl,
          seller_id: sellerId
        });
        
      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }
      
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        
        <Button 
          type="submit" 
          className="w-full bg-music-red hover:bg-red-600"
          disabled={isLoading}
        >
          {isLoading ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </Form>
  );
};
