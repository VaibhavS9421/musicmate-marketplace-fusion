
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useUserRole } from '../contexts/UserRoleContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole, signIn, user } = useUserRole();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (userRole === 'buyer') {
        navigate('/buyer/home');
      } else if (userRole === 'seller') {
        navigate('/seller/home');
      }
    }
  }, [user, userRole, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      
      // Redirect happens in useEffect when user state updates
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="logo-text text-3xl mb-2">
            <span className="text-music-red">Music</span>
            <span className="text-mate-black">Mate</span>
          </h1>
          <p className="text-gray-600">
            Login as {userRole === 'buyer' ? 'Buyer' : 'Seller'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <Button
            variant="link"
            className="text-gray-500"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </Button>
          <div>
            <span className="text-gray-600">Don't have an account? </span>
            <Button 
              variant="link" 
              className="text-music-red p-0"
              onClick={() => navigate('/signup')}
            >
              Create New Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
