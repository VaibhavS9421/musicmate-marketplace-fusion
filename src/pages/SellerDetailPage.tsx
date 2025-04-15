
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';

const SellerDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [aadharNumber, setAadharNumber] = useState('');
  const [address, setAddress] = useState('');
  const [aadharImage, setAadharImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-filled info from signup
  const name = localStorage.getItem('userName') || '';
  const email = localStorage.getItem('userEmail') || '';
  const mobile = localStorage.getItem('userMobile') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aadharNumber || !address || !aadharImage) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all the fields and upload your Aadhar image.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call to store seller details
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Profile completed",
        description: "Your seller profile has been created successfully!",
      });
      
      navigate('/seller/home');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save details",
        description: "There was an error saving your details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAadharUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAadharImage(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="logo-text text-3xl mb-2">
            <span className="text-music-red">Music</span>
            <span className="text-mate-black">Mate</span>
          </h1>
          <p className="text-gray-600">Complete your seller profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              type="text"
              value={name}
              disabled
              className="w-full bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              value={email}
              disabled
              className="w-full bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
            <Input
              type="tel"
              value={mobile}
              disabled
              className="w-full bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
            <Input
              type="text"
              placeholder="XXXX XXXX XXXX"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Textarea
              placeholder="Enter your full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Aadhar Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-music-red hover:text-red-500">
                    <span>Upload a file</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only"
                      accept="image/*"
                      onChange={handleAadharUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                {aadharImage && (
                  <p className="text-sm text-green-600">{aadharImage.name}</p>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-music-red hover:bg-red-600 mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save & Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SellerDetailPage;
