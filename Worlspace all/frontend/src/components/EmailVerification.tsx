import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, AlertCircle, Mail, Loader } from 'lucide-react';
import { useTenant } from '../utils/TenantContext';

interface EmailVerificationProps {
  token?: string;
  email?: string;
  onSuccess?: () => void;
}

export function EmailVerification({ token, email, onSuccess }: EmailVerificationProps) {
  const { verifyEmail, isLoading } = useTenant();
  const [step, setStep] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    }
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      setStep('verifying');
      const success = await verifyEmail(token!);

      if (success) {
        setStep('success');
        if (onSuccess) {
          setTimeout(onSuccess, 3000);
        }
      } else {
        setStep('error');
        setError('Failed to verify email. Please try again or request a new verification link.');
      }
    } catch (err: any) {
      setStep('error');
      setError(err.message || 'Verification failed');
    }
  };

  if (step === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            <CardTitle>Verifying Your Email</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-center text-gray-600">
              Please wait while we verify your email address...
            </p>
            {email && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Verifying: {email}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle>Email Verified Successfully!</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-center text-gray-600 mb-6">
              Your email has been verified. Your account is now active and ready to use.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                ✓ Email verified<br/>
                ✓ Account activated<br/>
                ✓ Ready to log in
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() => (window.location.href = '/login')}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle>Email Verification Failed</CardTitle>
        </CardHeader>

        <CardContent>
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error || 'The verification link is invalid or has expired.'}
            </AlertDescription>
          </Alert>

          <p className="text-sm text-gray-600 mb-6">
            Please check your email for a new verification link, or go back to complete your signup.
          </p>

          <div className="space-y-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => (window.location.href = '/login?tab=signup')}
            >
              Back to Signup
            </Button>
            <Button
              className="w-full"
              variant="default"
              onClick={() => (window.location.href = '/login')}
            >
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
