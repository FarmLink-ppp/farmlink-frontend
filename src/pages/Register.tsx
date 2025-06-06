import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  Users,
  Leaf,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    bio: "",
    location: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, register, isAuthenticated, error, clearError } = useAuth();
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
        title: "Registration Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        bio: formData.bio,
        location: formData.location,
      });
      toast({
        title: "Registration Successful",
        description: "Welcome to FarmLink! Your account has been created.",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Registration Error",
        description:
          "An error occurred while creating your account. Please try again.",
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

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
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
                Join the FarmLink Community
              </h1>
              <p className="text-xl text-farmlink-offwhite/90 leading-relaxed">
                Start your journey towards smarter farming. Connect with
                experts, get AI-powered insights, and grow your agricultural
                success.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-12">
            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  10,000+ Farmers
                </h3>
                <p className="text-farmlink-offwhite/80">
                  Join our growing community
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  AI-Powered Insights
                </h3>
                <p className="text-farmlink-offwhite/80">
                  Get personalized farming advice
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Increase Yields
                </h3>
                <p className="text-farmlink-offwhite/80">
                  Average 25% productivity boost
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-xl mx-auto lg:mx-0">
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
                Join FarmLink
              </CardTitle>
              <p className="text-farmlink-darkgreen/70 text-lg">
                Create your account and start smart farming
              </p>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-farmlink-darkgreen font-medium"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="John"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="h-11 border-2 border-farmlink-lightgreen/30 focus:border-farmlink-green transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-farmlink-darkgreen font-medium"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="john_doe"
                      value={formData.username}
                      onChange={handleChange}
                      className="h-11 border-2 border-farmlink-lightgreen/30 focus:border-farmlink-green transition-colors"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-farmlink-darkgreen font-medium"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-11 border-2 border-farmlink-lightgreen/30 focus:border-farmlink-green transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
                        className="h-11 pr-12 border-2 border-farmlink-lightgreen/30 focus:border-farmlink-green transition-colors"
                        required
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-farmlink-darkgreen/60" />
                        ) : (
                          <Eye className="h-4 w-4 text-farmlink-darkgreen/60" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-farmlink-darkgreen font-medium"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="h-11 pr-12 border-2 border-farmlink-lightgreen/30 focus:border-farmlink-green transition-colors"
                        required
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-farmlink-darkgreen/60" />
                        ) : (
                          <Eye className="h-4 w-4 text-farmlink-darkgreen/60" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-farmlink-darkgreen font-medium"
                  >
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Green Valley Farm"
                    value={formData.bio}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }));
                    }}
                    className="h-11 border-2 border-farmlink-lightgreen/30 focus:border-farmlink-green transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-farmlink-darkgreen font-medium"
                  >
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={handleChange}
                    className="h-11 border-2 border-farmlink-lightgreen/30 focus:border-farmlink-green transition-colors"
                    required
                  />
                </div>

                <div className="flex items-start space-x-3 mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`mt-0.5 p-0 h-5 w-5 rounded border-2 ${
                      acceptTerms
                        ? "bg-farmlink-green border-farmlink-green"
                        : "border-farmlink-lightgreen hover:border-farmlink-green"
                    } transition-all duration-200`}
                    onClick={() => setAcceptTerms(!acceptTerms)}
                  >
                    {acceptTerms && <Check className="h-3 w-3 text-white" />}
                  </Button>
                  <Label className="text-sm text-farmlink-darkgreen/80 leading-relaxed">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-farmlink-green hover:text-farmlink-darkgreen transition-colors font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-farmlink-green hover:text-farmlink-darkgreen transition-colors font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 mt-8"
                  disabled={isSubmitting || !acceptTerms}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-farmlink-darkgreen/70">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-farmlink-green hover:text-farmlink-darkgreen transition-colors font-semibold"
                  >
                    Sign in here
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

export default Register;
