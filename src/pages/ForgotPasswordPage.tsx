
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      toast({
        title: "Recovery email sent",
        description: "Please check your email for the password reset link."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send recovery email",
        description: error.message || "There was a problem sending the recovery email.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/login')} 
            className="flex items-center text-gray-600"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Back to Login</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="logo-text text-3xl mb-2">
            <span className="text-music-red">Music</span>
            <span className="text-mate-black">Mate</span>
          </h1>
          <h2 className="text-xl font-semibold mb-1">Forgot Password</h2>
          <p className="text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button 
              type="submit" 
              className="w-full bg-music-red hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        ) : (
          <div className="text-center p-4 bg-green-50 rounded-md border border-green-200">
            <p className="text-green-800 mb-4">
              Password reset instructions have been sent to your email.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="mt-2"
            >
              Return to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
