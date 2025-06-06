import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft, Leaf, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { LoginDto } from "@/types";

const Login = () => {
  const [formData, setFormData] = useState<LoginDto>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, login, isAuthenticated, error, clearError } = useAuth();
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
    clearError();
  }, [formData, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await login(formData);
      toast({
        title: "Login Successful",
        description: "Welcome back to FarmLink!",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmlink-green via-farmlink-mediumgreen to-farmlink-darkgreen flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 text-white">
          <div className="space-y-6">
            <img
              src="/uploads/y.png"
              alt="FarmLink Logo"
              className="w-32 h-32 object-contain"
            />
            <div>
              <h1 className="text-5xl font-bold mb-4 text-white">
                Welcome Back to FarmLink
              </h1>
              <p className="text-xl text-farmlink-offwhite/90 leading-relaxed">
                Your intelligent farming companion. Continue your journey
                towards smarter, more sustainable agriculture.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-12">
            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Smart Agriculture
                </h3>
                <p className="text-farmlink-offwhite/80">
                  AI-powered farming insights
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Community Driven
                </h3>
                <p className="text-farmlink-offwhite/80">
                  Connect with fellow farmers
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Secure & Reliable
                </h3>
                <p className="text-farmlink-offwhite/80">
                  Your data is protected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Back Button */}
          <Link
            to="/welcome"
            className="inline-flex items-center text-white mb-8 hover:text-farmlink-offwhite transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen"></div>

            <CardHeader className="text-center pt-8 pb-6">
              <CardTitle className="text-3xl text-farmlink-darkgreen mb-2">
                Welcome Back
              </CardTitle>
              <p className="text-farmlink-darkgreen/70 text-lg">
                Sign in to your FarmLink account
              </p>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-farmlink-darkgreen font-medium"
                  >
                    Username or Email Address
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter your username or email address"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="h-12 border-2 border-farmlink-lightgreen/30 focus:border-farmlink-green transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-farmlink-darkgreen font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-12 pr-12 border-2 border-farmlink-lightgreen/30 focus:border-farmlink-green transition-colors"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-farmlink-darkgreen/60" />
                      ) : (
                        <Eye className="h-5 w-5 text-farmlink-darkgreen/60" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-start">
                  <Link
                    to="/forgot-password"
                    className={`text-sm transition-colors font-medium ${
                      isSubmitting
                        ? "text-farmlink-darkgreen/40 pointer-events-none"
                        : "text-farmlink-green hover:text-farmlink-darkgreen"
                    }`}
                    tabIndex={isSubmitting ? -1 : 0}
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className={`w-full h-12 font-semibold text-lg shadow-lg transition-all duration-300 transform ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed opacity-60"
                      : "bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen hover:shadow-xl hover:-translate-y-0.5"
                  } text-white`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-farmlink-darkgreen/70">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className={`transition-colors font-semibold ${
                      isSubmitting
                        ? "text-farmlink-darkgreen/40 pointer-events-none"
                        : "text-farmlink-green hover:text-farmlink-darkgreen"
                    }`}
                    tabIndex={isSubmitting ? -1 : 0}
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
