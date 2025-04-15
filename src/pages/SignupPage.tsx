
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useUserRole } from '../contexts/UserRoleContext';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useUserRole();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here we would normally integrate with Supabase Auth
      // For now, let's simulate a successful signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userMobile', mobile);
      
      toast({
        title: "Account created",
        description: `Your account has been created successfully!`,
      });
      
      // Redirect based on user role
      if (userRole === 'seller') {
        navigate('/seller-details');
      } else {
        navigate('/buyer/home');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "There was an error creating your account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="logo-text text-3xl mb-2">
            <span className="text-music-red">Music</span>
            <span className="text-mate-black">Mate</span>
          </h1>
          <p className="text-gray-600">
            Create a new {userRole === 'buyer' ? 'Buyer' : 'Seller'} account
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-music-red hover:bg-red-600"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Button 
            variant="link" 
            className="text-music-red p-0"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
