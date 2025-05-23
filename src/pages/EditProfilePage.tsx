
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useUserRole } from '../contexts/UserRoleContext';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  name: string;
  email: string;
  mobile: string;
  address?: string;
  aadhar_number?: string;
}

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useUserRole();
  
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    mobile: '',
    address: '',
    aadhar_number: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
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
          // PGRST116 means no rows returned
          throw error;
        }
        
        if (data) {
          setProfile({
            name: data.name,
            email: data.email,
            mobile: data.mobile || '',
            address: data.address || '',
            aadhar_number: data.aadhar_number || ''
          });
        } else {
          // Use local storage as fallback
          setProfile({
            name: localStorage.getItem('userName') || '',
            email: localStorage.getItem('userEmail') || '',
            mobile: localStorage.getItem('userMobile') || '',
            address: '',
            aadhar_number: ''
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
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          mobile: localStorage.getItem('userMobile') || '',
          address: '',
          aadhar_number: ''
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate, toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.name || !profile.email || !profile.mobile) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all the required fields.",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authenticated session');
      }
      
      const userId = session.user.id;
      
      // Check if profile exists
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
        
      // Update or insert profile
      if (data) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({
            name: profile.name,
            mobile: profile.mobile,
            address: profile.address,
            aadhar_number: userRole === 'seller' ? profile.aadhar_number : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        if (error) throw error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: profile.name,
            email: profile.email,
            mobile: profile.mobile,
            role: userRole || 'buyer',
            address: profile.address,
            aadhar_number: userRole === 'seller' ? profile.aadhar_number : null
          });
          
        if (error) throw error;
      }
      
      // Update local storage
      localStorage.setItem('userName', profile.name);
      localStorage.setItem('userEmail', profile.email);
      localStorage.setItem('userMobile', profile.mobile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      navigate('/account');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: "There was an error updating your profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleBack = () => {
    navigate('/account');
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="page-container flex items-center justify-center min-h-screen">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

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
        
        <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              disabled
              className="w-full bg-gray-100"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              name="mobile"
              value={profile.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full"
              rows={3}
            />
          </div>
          
          {userRole === 'seller' && (
            <div>
              <Label htmlFor="aadhar_number">Aadhar Number</Label>
              <Input
                id="aadhar_number"
                name="aadhar_number"
                value={profile.aadhar_number}
                onChange={handleChange}
                placeholder="Enter your Aadhar number"
                className="w-full"
              />
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-music-red hover:bg-red-600 mt-6"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
