import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { forgotPassword, isLoading, error, clearError, isAuthenticated } =
    useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Password Reset Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleSubmit = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      clearError();

      await forgotPassword({ email });
      setIsSuccess(true);

      toast({
        title: "Reset Email Sent!",
        description: "Please check your email for password reset instructions.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description:
          error?.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setIsSuccess(false);
    setEmail("");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-farmlink-green via-farmlink-mediumgreen to-farmlink-darkgreen flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        </div>

        <div className="w-full max-w-md mx-auto relative z-10">
          <div className="text-center mb-8">
            <img
              src="/uploads/y.png"
              alt="FarmLink Logo"
              className="w-16 h-16 mx-auto mb-4 object-contain"
            />
            <h1 className="text-2xl font-bold text-white">FarmLink</h1>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen"></div>

            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl text-farmlink-darkgreen">
                Check Your Email
              </CardTitle>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-farmlink-darkgreen mb-2">
                    Reset Email Sent!
                  </h3>
                  <p className="text-farmlink-darkgreen/70 mb-4">
                    We've sent password reset instructions to{" "}
                    <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-farmlink-darkgreen/60 mb-6">
                    Please check your email and follow the instructions to reset
                    your password. The link will expire in 1 hour.
                  </p>
                </div>

                <div className="bg-farmlink-lightgreen/10 p-4 rounded-lg border border-farmlink-lightgreen/30">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-farmlink-green mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-farmlink-darkgreen/80">
                      <p className="font-medium mb-1">
                        Didn't receive the email?
                      </p>
                      <p>
                        Check your spam folder or click the button below to try
                        again.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleTryAgain}
                    variant="outline"
                    className="w-full border-farmlink-green text-farmlink-green hover:bg-farmlink-green hover:text-white"
                  >
                    Send Another Email
                  </Button>

                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-farmlink-green hover:bg-farmlink-mediumgreen text-white"
                  >
                    Back to Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmlink-green via-farmlink-mediumgreen to-farmlink-darkgreen flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="text-center mb-8">
          <img
            src="/uploads/y.png"
            alt="FarmLink Logo"
            className="w-16 h-16 mx-auto mb-4 object-contain"
          />
          <h1 className="text-2xl font-bold text-white">FarmLink</h1>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen"></div>

          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl text-farmlink-darkgreen">
              Forgot Password?
            </CardTitle>
            <p className="text-farmlink-darkgreen/70 mt-2">
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-farmlink-darkgreen">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-farmlink-green" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-farmlink-lightgreen/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmlink-green focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !email}
                className="w-full bg-farmlink-green hover:bg-farmlink-mediumgreen text-white py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending Reset Email...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Send Reset Email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-farmlink-green hover:text-farmlink-darkgreen transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-white font-medium hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
