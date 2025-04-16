
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUserRole } from '../contexts/UserRoleContext';
import BuyerBottomNav from '@/components/BuyerBottomNav';
import SellerBottomNav from '@/components/SellerBottomNav';
import { supabase } from '@/integrations/supabase/client';
import { Edit } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  mobile: string;
  address?: string;
}

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useUserRole();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }
        
        const userId = session.user.id;
        
        // Fetch profile from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          // PGRST116 means no rows returned - this just means the profile doesn't exist yet
          throw error;
        }
        
        if (data) {
          setProfile({
            name: data.name,
            email: data.email,
            mobile: data.mobile || '',
            address: data.address
          });
        } else {
          // Use local storage as fallback
          setProfile({
            name: localStorage.getItem('userName') || 'User',
            email: localStorage.getItem('userEmail') || 'user@example.com',
            mobile: localStorage.getItem('userMobile') || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Failed to load profile",
          description: "There was an error loading your profile information.",
        });
        
        // Use local storage as fallback
        setProfile({
          name: localStorage.getItem('userName') || 'User',
          email: localStorage.getItem('userEmail') || 'user@example.com',
          mobile: localStorage.getItem('userMobile') || ''
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate, toast]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userMobile');
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      navigate('/role-selection');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem logging you out. Please try again.",
      });
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="app-container pb-16">
      <div className="page-container">
        <h1 className="text-2xl font-semibold py-4">Account</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500">Loading profile...</p>
          </div>
        ) : profile ? (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4 text-gray-500"
              onClick={handleEditProfile}
            >
              <Edit size={18} />
            </Button>
            <h2 className="text-lg font-medium mb-1">{profile.name}</h2>
            <p className="text-gray-600 mb-1">{profile.email}</p>
            <p className="text-gray-600 mb-1">{profile.mobile}</p>
            {profile.address && <p className="text-gray-600 mb-1">{profile.address}</p>}
            <p className="text-sm text-music-red font-medium">{userRole === 'buyer' ? 'Buyer Account' : 'Seller Account'}</p>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-gray-500">No profile information available</p>
          </div>
        )}
        
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start text-left h-12"
            onClick={() => navigate('/orders')}
          >
            My Orders
          </Button>
        </div>
        
        <Button
          variant="destructive"
          className="w-full mt-8"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      
      {userRole === 'buyer' ? <BuyerBottomNav /> : <SellerBottomNav />}
    </div>
  );
};

export default AccountPage;
