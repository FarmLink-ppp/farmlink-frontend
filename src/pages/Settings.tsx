
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, User, Bell, Lock, Shield, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  farmName: string;
  farmLocation: string;
}

const initialFormValues: FormValues = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  farmName: "Greenfield Farm",
  farmLocation: "Rural County, State",
};

const Settings = () => {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [formModified, setFormModified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Notification states
  const [emailNotifications, setEmailNotifications] = useState({
    tasks: true,
    community: true,
    weather: true,
    aiInsights: true,
  });
  
  // Privacy states
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showLocation: false,
    dataForAI: true,
  });
  
  // Security states
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const { toast } = useToast();

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormModified(true);
  };

  // Handle avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormModified(true);
    }
  };

  // Save profile changes
  const handleSaveProfile = () => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setFormModified(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
        duration: 3000,
      });
    }, 1000);
  };

  // Toggle notification settings
  const toggleNotification = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Notification Preference Updated",
      description: `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${emailNotifications[key] ? 'disabled' : 'enabled'}.`,
      duration: 2000,
    });
  };

  // Toggle privacy settings
  const togglePrivacy = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Privacy Setting Updated",
      description: `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} setting ${privacySettings[key] ? 'disabled' : 'enabled'}.`,
      duration: 2000,
    });
  };

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.new !== passwordForm.confirm) {
      toast({
        title: "Password Error",
        description: "New password and confirmation do not match.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setPasswordForm({
        current: "",
        new: "",
        confirm: "",
      });
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
        duration: 3000,
      });
    }, 1000);
  };

  // Toggle 2FA
  const toggle2FA = () => {
    setTwoFactorEnabled(prev => !prev);
    
    toast({
      title: "Two-Factor Authentication",
      description: twoFactorEnabled 
        ? "Two-factor authentication disabled." 
        : "Two-factor authentication enabled. You will receive setup instructions by email.",
      duration: 3000,
    });
  };

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
                        <CardTitle className="text-farmlink-darkgreen">Personal Information</CardTitle>
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
                            <AvatarImage src={avatarPreview} className="object-cover" />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen text-white text-2xl font-bold">
                              JD
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border-2 border-farmlink-lightgreen/30">
                          <Camera className="h-4 w-4 text-farmlink-green" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-farmlink-green text-farmlink-green hover:bg-farmlink-green hover:text-white transition-all duration-200 rounded-lg" 
                            type="button"
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
                          JPG, GIF or PNG. Max size of 2MB.
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="bg-farmlink-lightgreen/20" />
                    
                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="firstName" className="text-farmlink-darkgreen font-medium">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={formValues.firstName}
                          onChange={handleInputChange}
                          className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="lastName" className="text-farmlink-darkgreen font-medium">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={formValues.lastName}
                          onChange={handleInputChange}
                          className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-farmlink-darkgreen font-medium">Email</Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email" 
                          value={formValues.email}
                          onChange={handleInputChange}
                          className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-farmlink-darkgreen font-medium">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone"
                          value={formValues.phone}
                          onChange={handleInputChange}
                          className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="farmName" className="text-farmlink-darkgreen font-medium">Farm Name</Label>
                      <Input 
                        id="farmName" 
                        name="farmName"
                        value={formValues.farmName}
                        onChange={handleInputChange}
                        className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="farmLocation" className="text-farmlink-darkgreen font-medium">Farm Location</Label>
                      <Input 
                        id="farmLocation" 
                        name="farmLocation"
                        value={formValues.farmLocation}
                        onChange={handleInputChange}
                        className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                      />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={!formModified || isSubmitting}
                        className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg px-8"
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-farmlink-green/10 to-farmlink-mediumgreen/10 border-b border-farmlink-lightgreen/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen rounded-lg">
                        <Bell className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-farmlink-darkgreen">Notification Settings</CardTitle>
                        <CardDescription className="text-farmlink-darkgreen/70">
                          Control how you receive notifications
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-farmlink-darkgreen">Email Notifications</h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                          <div className="space-y-1">
                            <p className="font-medium text-farmlink-darkgreen">Task reminders</p>
                            <p className="text-sm text-farmlink-darkgreen/70">Receive notifications about upcoming tasks</p>
                          </div>
                          <Switch 
                            checked={emailNotifications.tasks} 
                            onCheckedChange={() => toggleNotification("tasks")}
                            className="data-[state=checked]:bg-farmlink-green"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                          <div className="space-y-1">
                            <p className="font-medium text-farmlink-darkgreen">Community activity</p>
                            <p className="text-sm text-farmlink-darkgreen/70">Updates about replies and mentions</p>
                          </div>
                          <Switch 
                            checked={emailNotifications.community} 
                            onCheckedChange={() => toggleNotification("community")}
                            className="data-[state=checked]:bg-farmlink-green"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                          <div className="space-y-1">
                            <p className="font-medium text-farmlink-darkgreen">Weather alerts</p>
                            <p className="text-sm text-farmlink-darkgreen/70">Important weather changes affecting your farm</p>
                          </div>
                          <Switch 
                            checked={emailNotifications.weather} 
                            onCheckedChange={() => toggleNotification("weather")}
                            className="data-[state=checked]:bg-farmlink-green"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                          <div className="space-y-1">
                            <p className="font-medium text-farmlink-darkgreen">AI insights</p>
                            <p className="text-sm text-farmlink-darkgreen/70">Receive AI-generated farming recommendations</p>
                          </div>
                          <Switch 
                            checked={emailNotifications.aiInsights} 
                            onCheckedChange={() => toggleNotification("aiInsights")}
                            className="data-[state=checked]:bg-farmlink-green"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="privacy" className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-farmlink-green/10 to-farmlink-mediumgreen/10 border-b border-farmlink-lightgreen/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen rounded-lg">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-farmlink-darkgreen">Privacy Settings</CardTitle>
                        <CardDescription className="text-farmlink-darkgreen/70">
                          Control your data and profile visibility
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-farmlink-darkgreen">Profile Visibility</h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                          <div className="space-y-1">
                            <p className="font-medium text-farmlink-darkgreen">Public profile</p>
                            <p className="text-sm text-farmlink-darkgreen/70">Allow other farmers to view your profile</p>
                          </div>
                          <Switch 
                            checked={privacySettings.publicProfile} 
                            onCheckedChange={() => togglePrivacy("publicProfile")}
                            className="data-[state=checked]:bg-farmlink-green"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                          <div className="space-y-1">
                            <p className="font-medium text-farmlink-darkgreen">Show farm location</p>
                            <p className="text-sm text-farmlink-darkgreen/70">Display your farm location on your profile</p>
                          </div>
                          <Switch 
                            checked={privacySettings.showLocation} 
                            onCheckedChange={() => togglePrivacy("showLocation")}
                            className="data-[state=checked]:bg-farmlink-green"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                          <div className="space-y-1">
                            <p className="font-medium text-farmlink-darkgreen">Data usage for AI insights</p>
                            <p className="text-sm text-farmlink-darkgreen/70">Allow your farm data to improve AI recommendations</p>
                          </div>
                          <Switch 
                            checked={privacySettings.dataForAI} 
                            onCheckedChange={() => togglePrivacy("dataForAI")}
                            className="data-[state=checked]:bg-farmlink-green"
                          />
                        </div>
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
                        <CardTitle className="text-farmlink-darkgreen">Security Settings</CardTitle>
                        <CardDescription className="text-farmlink-darkgreen/70">
                          Manage your account security
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <h3 className="text-lg font-semibold text-farmlink-darkgreen">Change Password</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-farmlink-darkgreen font-medium">Current Password</Label>
                          <Input 
                            id="currentPassword" 
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                            className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-farmlink-darkgreen font-medium">New Password</Label>
                          <Input 
                            id="newPassword" 
                            type="password"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                            className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-farmlink-darkgreen font-medium">Confirm New Password</Label>
                          <Input 
                            id="confirmPassword" 
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                            className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 rounded-lg"
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg"
                          disabled={!passwordForm.current || !passwordForm.new || !passwordForm.confirm || isSubmitting}
                        >
                          {isSubmitting ? "Updating..." : "Update Password"}
                        </Button>
                      </div>
                    </form>
                    
                    <Separator className="bg-farmlink-lightgreen/20" />
                    
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-farmlink-darkgreen">Two-Factor Authentication</h3>
                      
                      <div className="flex items-center justify-between p-4 bg-farmlink-offwhite/50 rounded-xl border border-farmlink-lightgreen/20">
                        <div className="space-y-1">
                          <p className="font-medium text-farmlink-darkgreen">Enable 2FA</p>
                          <p className="text-sm text-farmlink-darkgreen/70">Add an extra layer of security to your account</p>
                        </div>
                        <Switch 
                          checked={twoFactorEnabled}
                          onCheckedChange={toggle2FA}
                          className="data-[state=checked]:bg-farmlink-green"
                        />
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