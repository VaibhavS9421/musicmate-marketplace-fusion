
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useUserRole } from '../contexts/UserRoleContext';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole, signUp, user } = useUserRole();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (userRole === 'buyer') {
        navigate('/buyer/home');
      } else if (userRole === 'seller') {
        navigate('/seller-details');
      }
    }
  }, [user, userRole, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      });
      return;
    }
    
    // Validate password strength
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too weak",
        description: "Password should be at least 6 characters long.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create user metadata object
      const userData = {
        name,
        mobile,
        role: userRole
      };
      
      const { error } = await signUp(email, password, userData);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully! Please verify your email to continue.",
      });
      
      // Store user info temporarily
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userMobile', mobile);
      
      // Redirect to email verification page or directly to home/details based on userRole
      if (userRole === 'seller') {
        navigate('/seller-details');
      } else {
        navigate('/buyer/home');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "There was an error creating your account.",
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
          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
