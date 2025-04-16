
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if there's a recovery token in the URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    
    if (token) {
      // Skip OTP verification if we have a token from the email link
      setStep('reset');
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real implementation, you would verify the OTP code here
      // For this example, we're just moving to the next step
      if (otp.length === 6) {
        setStep('reset');
      } else {
        throw new Error("Please enter a valid 6-digit code");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.message || "The code you entered is not valid.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      });
      return;
    }
    
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
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }

      toast({
        title: "Password updated",
        description: "Your password has been reset successfully.",
      });
      
      // Redirect to login page
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message || "There was an error resetting your password.",
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
          <h2 className="text-xl font-semibold mb-1">
            {step === 'verify' ? 'Verify Code' : 'Reset Password'}
          </h2>
          <p className="text-gray-600">
            {step === 'verify' 
              ? 'Enter the verification code sent to your email'
              : 'Enter your new password'}
          </p>
        </div>

        {step === 'verify' ? (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-music-red hover:bg-red-600"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm New Password"
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
              {isLoading ? "Updating..." : "Reset Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
