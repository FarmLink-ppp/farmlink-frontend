import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Lock, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Reset Password Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || token.length !== 32) {
      toast({
        title: "Invalid Token",
        description: "Please enter a valid 32-character reset token.",
        variant: "destructive",
      });
      return;
    }
    if (!password || password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirm) {
      toast({
        title: "Passwords Do Not Match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      setStatus("loading");
      clearError();
      await resetPassword({ token, password });
      setStatus("success");
      toast({
        title: "Password Reset Successful",
        description: "You can now log in with your new password.",
        variant: "default",
      });
      setTimeout(() => navigate("/login", { replace: true }), 3000);
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-farmlink-green/20 rounded-full flex items-center justify-center">
              <RefreshCw className="h-8 w-8 text-farmlink-green animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-farmlink-darkgreen mb-2">
              Resetting Password...
            </h2>
            <p className="text-farmlink-darkgreen/70">
              Please wait while we reset your password.
            </p>
          </div>
        );
      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-farmlink-darkgreen mb-2">
              Password Reset!
            </h2>
            <p className="text-farmlink-darkgreen/70 mb-4">
              Your password has been reset successfully. Redirecting to login...
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-farmlink-green hover:bg-farmlink-mediumgreen text-white"
            >
              Go to Login
            </Button>
          </div>
        );
      case "error":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-farmlink-darkgreen mb-2">
              Reset Failed
            </h2>
            <p className="text-farmlink-darkgreen/70 mb-4">
              {error ||
                "The reset token may be invalid or expired. Please try again."}
            </p>
            <Button
              onClick={() => setStatus("idle")}
              className="bg-farmlink-green hover:bg-farmlink-mediumgreen text-white"
            >
              Try Again
            </Button>
          </div>
        );
      default:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-farmlink-green mr-2" />
              <span className="text-farmlink-darkgreen font-bold text-lg">
                Reset Your Password
              </span>
            </div>
            <input
              type="text"
              placeholder="Enter 32-character reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={32}
              className="w-full px-4 py-3 border border-farmlink-lightgreen/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmlink-green font-mono text-sm tracking-wider text-center"
              required
            />
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="w-full px-4 py-3 border border-farmlink-lightgreen/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmlink-green"
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={8}
              className="w-full px-4 py-3 border border-farmlink-lightgreen/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmlink-green"
              required
            />
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !token ||
                token.length !== 32 ||
                !password ||
                password.length < 8 ||
                password !== confirm
              }
              className="w-full bg-farmlink-green hover:bg-farmlink-mediumgreen text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Resetting...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-farmlink-green hover:text-farmlink-darkgreen transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </form>
        );
    }
  };

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
              Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
