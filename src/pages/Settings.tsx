import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Shield,
  Camera,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { AccountType, UpdatePasswordDto } from "@/types";
import { Textarea } from "@/components/ui/textarea";

interface FormValues {
  fullName: string;
  username: string;
  email: string;
  bio: string;
  location: string;
}

const Settings = () => {
  const {
    profile,
    loading,
    error,
    updateProfileInfo,
    updateAccountType,
    updatePassword,
    isUpdating,
    clearError,
  } = useUserProfile();
  const { toast } = useToast();

  const [formModified, setFormModified] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<FormValues>({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    location: "",
  });

  // Privacy states
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    dataForAI: true,
  });
  const [privacyModified, setPrivacyModified] = useState(false);
  const [isPrivacyUpdating, setIsPrivacyUpdating] = useState(false);

  // Security states
  const [passwordForm, setPasswordForm] = useState<
    UpdatePasswordDto & { confirm: string }
  >({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormValues({
        fullName: profile.full_name || "",
        username: profile.username || "",
        email: profile.email || "",
        bio: profile.bio || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormModified(true);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setFormModified(true);
        toast({ title: "Image uploaded successfully!", duration: 2000 });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file (JPG, PNG, GIF).",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      clearError();
      if (!formModified) {
        toast({
          title: "No Changes Detected",
          description: "Please modify your profile before saving.",
          duration: 2000,
        });
        return;
      }
      const updatedProfile = await updateProfileInfo(formValues, avatarFile);
      setFormModified(false);
      setAvatarFile(null);
      setAvatarPreview(null);

      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Toggle privacy settings
  const togglePrivacy = (key: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setPrivacyModified(true);

    toast({
      title: "Privacy Setting Updated",
      description: `${
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")
      } setting ${privacySettings[key] ? "disabled" : "enabled"}.`,
      duration: 2000,
    });
  };

  const handleSavePrivacy = async () => {
    try {
      if (!privacyModified) {
        toast({
          title: "No Changes Detected",
          description: "Please modify your privacy settings before saving.",
          duration: 2000,
        });
        return;
      }

      setIsPrivacyUpdating(true);

      // Update account type based on public profile setting
      const accountType: AccountType = privacySettings.publicProfile
        ? AccountType.PUBLIC
        : AccountType.PRIVATE;

      await updateAccountType({ accountType });

      setPrivacyModified(false);

      toast({
        title: "Privacy Settings Updated",
        description: `Your profile is now ${accountType}.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsPrivacyUpdating(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast({
        title: "Password Error",
        description: "New password and confirmation do not match.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password Error",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      clearError();
      setIsPasswordUpdating(true);
      const passwordData: UpdatePasswordDto = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      };

      await updatePassword(passwordData);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirm: "",
      });

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Password Update Failed",
        description:
          "Failed to update password. Please check your current password.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-farmlink-offwhite via-white to-farmlink-offwhite flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-farmlink-green" />
            <p className="text-farmlink-darkgreen">Loading your settings...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error && !profile) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-farmlink-offwhite via-white to-farmlink-offwhite flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-red-600">Failed to load settings: {error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-farmlink-green hover:bg-farmlink-mediumgreen"
            >
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-farmlink-offwhite via-white to-farmlink-offwhite">
        <div className="space-y-8 p-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen rounded-full shadow-lg mb-4">
              <SettingsIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-farmlink-darkgreen to-farmlink-green bg-clip-text text-transparent">
                Account Settings
              </h1>
              <p className="text-farmlink-darkgreen/70 text-lg mt-2">
                Manage your account preferences and farm settings
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full bg-white/80 backdrop-blur-sm border border-farmlink-lightgreen/20 shadow-lg rounded-xl p-1">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-farmlink-green data-[state=active]:to-farmlink-mediumgreen data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-200"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-farmlink-green data-[state=active]:to-farmlink-mediumgreen data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-200"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-farmlink-green data-[state=active]:to-farmlink-mediumgreen data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-200"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-farmlink-green data-[state=active]:to-farmlink-mediumgreen data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-200"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-farmlink-green/10 to-farmlink-mediumgreen/10 border-b border-farmlink-lightgreen/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen rounded-lg">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-farmlink-darkgreen">
                          Personal Information
                        </CardTitle>
                        <CardDescription className="text-farmlink-darkgreen/70">
                          Update your profile details and farm information
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                      <div className="relative">
                        <Avatar className="w-28 h-28 border-4 border-farmlink-lightgreen/30 shadow-lg">
                          {avatarPreview ? (
                            <AvatarImage
                              src={avatarPreview}
                              className="object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : profile?.profile_image ? (
                            <img
                              src={profile?.profile_image}
                              className="object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen text-white text-2xl font-bold">
                              {getUserInitials()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border-2 border-farmlink-lightgreen/30">
                          <Camera className="h-4 w-4 text-farmlink-green" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label
                          htmlFor="avatar-upload"
                          className="cursor-pointer"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-farmlink-green text-farmlink-green hover:bg-farmlink-green hover:text-white transition-all duration-200 rounded-lg"
                            type="button"
                            onClick={() =>
                              document.getElementById("avatar-upload")?.click()
                            }
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Change Avatar
                          </Button>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                        </label>
                        <p className="text-sm text-farmlink-darkgreen/60">
                          JPG, GIF or PNG. Max size of 1MB.
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-farmlink-lightgreen/20" />

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="fullName"
                          className="text-farmlink-darkgreen font-medium"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formValues.fullName}
                          onChange={handleInputChange}
                          className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="username"
                          className="text-farmlink-darkgreen font-medium"
                        >
                          Username
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          value={formValues.username}
                          onChange={handleInputChange}
                          className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="email"
                          className="text-farmlink-darkgreen font-medium"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formValues.email}
                          onChange={handleInputChange}
                          className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="phone"
                        className="text-farmlink-darkgreen font-medium"
                      >
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formValues.bio}
                        onChange={handleInputChange}
                        className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="phone"
                        className="text-farmlink-darkgreen font-medium"
                      >
                        Location
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        value={formValues.location}
                        onChange={handleInputChange}
                        className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={!formModified || isUpdating}
                        className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg px-8"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <div className="relative">
                  {/* Coming Soon Overlay */}
                  <div className="absolute inset-0 bg-farmlink-darkgreen/20 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                    <div className="bg-white/95 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-2xl border border-farmlink-lightgreen/30">
                      <div className="text-center space-y-3">
                        <div className="p-3 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                          <Bell className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-farmlink-darkgreen mb-2">
                            Coming Soon
                          </h3>
                          <p className="text-farmlink-darkgreen/70 text-sm max-w-xs">
                            Advanced notification settings will be available in
                            the next update
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Original Component (with reduced opacity) */}
                  <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden opacity-50">
                    <CardHeader className="bg-gradient-to-r from-farmlink-green/10 to-farmlink-mediumgreen/10 border-b border-farmlink-lightgreen/20">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen rounded-lg">
                          <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-farmlink-darkgreen">
                            Notification Settings
                          </CardTitle>
                          <CardDescription className="text-farmlink-darkgreen/70">
                            Control how you receive notifications
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-farmlink-darkgreen">
                          Email Notifications
                        </h3>

                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                            <div className="space-y-1">
                              <p className="font-medium text-farmlink-darkgreen">
                                Task reminders
                              </p>
                              <p className="text-sm text-farmlink-darkgreen/70">
                                Receive notifications about upcoming tasks
                              </p>
                            </div>
                            <Switch
                              checked={true}
                              className="data-[state=checked]:bg-farmlink-green"
                              disabled
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                            <div className="space-y-1">
                              <p className="font-medium text-farmlink-darkgreen">
                                Community activity
                              </p>
                              <p className="text-sm text-farmlink-darkgreen/70">
                                Updates about replies and mentions
                              </p>
                            </div>
                            <Switch
                              checked={true}
                              className="data-[state=checked]:bg-farmlink-green"
                              disabled
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                            <div className="space-y-1">
                              <p className="font-medium text-farmlink-darkgreen">
                                Weather alerts
                              </p>
                              <p className="text-sm text-farmlink-darkgreen/70">
                                Important weather changes affecting your farm
                              </p>
                            </div>
                            <Switch
                              checked={true}
                              className="data-[state=checked]:bg-farmlink-green"
                              disabled
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                            <div className="space-y-1">
                              <p className="font-medium text-farmlink-darkgreen">
                                AI insights
                              </p>
                              <p className="text-sm text-farmlink-darkgreen/70">
                                Receive AI-generated farming recommendations
                              </p>
                            </div>
                            <Switch
                              checked={true}
                              className="data-[state=checked]:bg-farmlink-green"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-farmlink-green/10 to-farmlink-mediumgreen/10 border-b border-farmlink-lightgreen/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen rounded-lg">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-farmlink-darkgreen">
                          Privacy Settings
                        </CardTitle>
                        <CardDescription className="text-farmlink-darkgreen/70">
                          Control your data and profile visibility
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-farmlink-darkgreen">
                        Profile Visibility
                      </h3>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                          <div className="space-y-1">
                            <p className="font-medium text-farmlink-darkgreen">
                              Public profile
                            </p>
                            <p className="text-sm text-farmlink-darkgreen/70">
                              Allow other farmers to view your profile
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.publicProfile}
                            onCheckedChange={() =>
                              togglePrivacy("publicProfile")
                            }
                            className="data-[state=checked]:bg-farmlink-green"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                          <div className="space-y-1">
                            <p className="font-medium text-farmlink-darkgreen">
                              Data usage for AI insights
                            </p>
                            <p className="text-sm text-farmlink-darkgreen/70">
                              Allow your farm data to improve AI recommendations
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.dataForAI}
                            onCheckedChange={() => togglePrivacy("dataForAI")}
                            className="data-[state=checked]:bg-farmlink-green"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-4">
                        <Button
                          onClick={handleSavePrivacy}
                          disabled={!privacyModified || isPrivacyUpdating}
                          className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg px-8"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-farmlink-green/10 to-farmlink-mediumgreen/10 border-b border-farmlink-lightgreen/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen rounded-lg">
                        <Lock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-farmlink-darkgreen">
                          Security Settings
                        </CardTitle>
                        <CardDescription className="text-farmlink-darkgreen/70">
                          Manage your account security
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <h3 className="text-lg font-semibold text-farmlink-darkgreen">
                        Change Password
                      </h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="currentPassword"
                            className="text-farmlink-darkgreen font-medium"
                          >
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value,
                              })
                            }
                            className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="newPassword"
                            className="text-farmlink-darkgreen font-medium"
                          >
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                            className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-farmlink-darkgreen font-medium"
                          >
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirm: e.target.value,
                              })
                            }
                            className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg"
                          disabled={
                            !passwordForm.currentPassword ||
                            !passwordForm.newPassword ||
                            !passwordForm.confirm ||
                            isPasswordUpdating
                          }
                        >
                          {isPasswordUpdating
                            ? "Updating..."
                            : "Update Password"}
                        </Button>
                      </div>
                    </form>

                    <Separator className="bg-farmlink-lightgreen/20" />

                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-farmlink-darkgreen">
                        Two-Factor Authentication
                      </h3>

                      <div className="relative">
                        {/* Coming Soon Overlay */}
                        <div className="absolute inset-0 bg-farmlink-darkgreen/10 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-farmlink-lightgreen/30">
                            <span className="text-sm font-semibold text-farmlink-darkgreen">
                              Coming Soon
                            </span>
                          </div>
                        </div>

                        {/* Original Component with reduced opacity */}
                        <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/30 rounded-xl border border-farmlink-lightgreen/20 opacity-50">
                          <div className="space-y-1">
                            <p className="font-medium text-farmlink-darkgreen">
                              Enable 2FA
                            </p>
                            <p className="text-sm text-farmlink-darkgreen/70">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch
                            className="data-[state=checked]:bg-farmlink-green"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
