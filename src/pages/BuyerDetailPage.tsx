
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BuyerDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pre-filled info from signup
  const name = localStorage.getItem('userName') || '';
  const email = localStorage.getItem('userEmail') || '';
  const mobile = localStorage.getItem('userMobile') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in your delivery address.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('No user session found');
      }

      // Update profile with buyer details
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          address,
          role: 'buyer'
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;
      
      toast({
        title: "Profile completed",
        description: "Your buyer profile has been created successfully!",
      });
      
      navigate('/buyer/home');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to save details",
        description: error.message || "There was an error saving your details.",
      });
    } finally {
      setIsLoading(false);
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
          <p className="text-gray-600">Complete your buyer profile</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <Textarea
              placeholder="Enter your full delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full"
              rows={3}
            />
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

export default BuyerDetailPage;
