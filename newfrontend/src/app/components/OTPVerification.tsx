import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => void;
}

export function OTPVerification({ email, onVerify }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  const handleResend = () => {
    alert('OTP resent to ' + email);
    setOtp('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
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
          
          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={handleVerify}
              disabled={otp.length !== 6}
            >
              Verify Email
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleResend}
            >
              Resend Code
            </Button>
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            Enter the code sent to your email to complete registration
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
