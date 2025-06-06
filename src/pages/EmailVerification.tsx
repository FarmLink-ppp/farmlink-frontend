import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  Mail,
  ArrowRight,
  RefreshCw,
  Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const EmailVerification = () => {
  const {
    verifyEmail,
    resendVerificationEmail,
    isLoading,
    error,
    clearError,
    isAuthenticated,
  } = useAuth();

  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [token, setToken] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Email Verification Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleVerification = async () => {
    if (!token || token.length !== 32) {
      toast({
        title: "Invalid Token",
        description: "Please enter a valid 32-character verification token.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationStatus("loading");
      clearError();

      await verifyEmail({ token });
      setVerificationStatus("success");

      toast({
        title: "Email Verified Successfully!",
        description:
          "Your email has been verified. You can now access all features.",
        variant: "default",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    } catch (error) {
      setVerificationStatus("error");
      toast({
        title: "Verification Failed",
        description:
          error?.message || "The verification code is invalid or expired.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to resend verification.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsResending(true);
      await resendVerificationEmail({ email: resendEmail });

      toast({
        title: "Verification Email Sent",
        description: "A new verification email has been sent to your inbox.",
        variant: "default",
      });

      setResendEmail("");
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-farmlink-green/20 rounded-full flex items-center justify-center">
              <RefreshCw className="h-8 w-8 text-farmlink-green animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-farmlink-darkgreen mb-2">
                Verifying Your Email
              </h2>
              <p className="text-farmlink-darkgreen/70">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-farmlink-darkgreen mb-2">
                Email Verified Successfully!
              </h2>
              <p className="text-farmlink-darkgreen/70 mb-4">
                Your email has been successfully verified. You can now access
                all FarmLink features.
              </p>
              <p className="text-sm text-farmlink-darkgreen/60">
                Redirecting you to login page in a few seconds...
              </p>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="bg-farmlink-green hover:bg-farmlink-mediumgreen text-white"
            >
              Continue to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case "error":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-farmlink-darkgreen mb-2">
                Verification Failed
              </h2>
              <p className="text-farmlink-darkgreen/70 mb-4">
                {error ||
                  "The verification token may be invalid or expired. Please try again."}
              </p>
            </div>

            {/* Try again section */}
            <div className="bg-farmlink-lightgreen/10 p-6 rounded-lg border border-farmlink-lightgreen/30">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-5 w-5 text-farmlink-green mr-2" />
                <span className="text-farmlink-darkgreen font-medium">
                  Enter Verification Token
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <input
                    type="text"
                    placeholder="Enter 32-character verification token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    maxLength={32}
                    className="w-full px-4 py-3 border border-farmlink-lightgreen/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmlink-green focus:border-transparent font-mono text-sm tracking-wider text-center"
                  />
                </div>

                <Button
                  onClick={handleVerification}
                  disabled={isVerifying || token.length !== 32}
                  className="w-full bg-farmlink-green hover:bg-farmlink-mediumgreen text-white"
                >
                  {isVerifying ? (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </div>
            </div>

            {/* Resend verification section */}
            <div className="bg-farmlink-lightgreen/10 p-6 rounded-lg border border-farmlink-lightgreen/30">
              <div className="flex items-center justify-center mb-4">
                <Mail className="h-5 w-5 text-farmlink-green mr-2" />
                <span className="text-farmlink-darkgreen font-medium">
                  Resend Verification Email
                </span>
              </div>

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-farmlink-lightgreen/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmlink-green focus:border-transparent"
                />

                <Button
                  onClick={handleResendVerification}
                  disabled={isResending || !resendEmail}
                  className="w-full bg-farmlink-green hover:bg-farmlink-mediumgreen text-white"
                >
                  {isResending ? (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="text-farmlink-green hover:text-farmlink-darkgreen transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        );

      default: // idle state
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-farmlink-green/20 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-farmlink-green" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-farmlink-darkgreen mb-2">
                Enter Verification Token
              </h2>
              <p className="text-farmlink-darkgreen/70 mb-4">
                Please enter the 32-character verification token sent to your
                email address.
              </p>
            </div>

            {/* OTP Input section */}
            <div className="bg-farmlink-lightgreen/10 p-6 rounded-lg border border-farmlink-lightgreen/30">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <input
                    type="text"
                    placeholder="Enter 32-character verification token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    maxLength={32}
                    className="w-full px-4 py-3 border border-farmlink-lightgreen/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmlink-green focus:border-transparent font-mono text-sm tracking-wider text-center"
                  />
                </div>

                <Button
                  onClick={handleVerification}
                  disabled={isVerifying || token.length !== 32}
                  className="w-full bg-farmlink-green hover:bg-farmlink-mediumgreen text-white"
                >
                  {isVerifying ? (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </div>
            </div>

            {/* Resend verification section */}
            <div className="bg-farmlink-lightgreen/10 p-6 rounded-lg border border-farmlink-lightgreen/30">
              <div className="flex items-center justify-center mb-4">
                <Mail className="h-5 w-5 text-farmlink-green mr-2" />
                <span className="text-farmlink-darkgreen font-medium">
                  Didn't receive the token?
                </span>
              </div>

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-farmlink-lightgreen/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmlink-green focus:border-transparent"
                />

                <Button
                  onClick={handleResendVerification}
                  disabled={isResending || !resendEmail}
                  className="w-full bg-farmlink-green hover:bg-farmlink-mediumgreen text-white"
                >
                  {isResending ? (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    "Send New Token"
                  )}
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/register"
                className="text-farmlink-green hover:text-farmlink-darkgreen transition-colors mr-4"
              >
                Create New Account
              </Link>
              <span className="text-farmlink-darkgreen/50">|</span>
              <Link
                to="/login"
                className="text-farmlink-green hover:text-farmlink-darkgreen transition-colors ml-4"
              >
                Back to Login
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmlink-green via-farmlink-mediumgreen to-farmlink-darkgreen flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Logo */}
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
              Email Verification
            </CardTitle>
          </CardHeader>

          <CardContent className="px-8 pb-8">{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
