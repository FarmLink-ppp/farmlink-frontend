
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
import { Settings as SettingsIcon, User, Bell, Lock, Shield } from "lucide-react";
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <SettingsIcon className="mr-2 h-7 w-7 text-farmlink-green" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account preferences and farm settings
          </p>
        </div>
        
        <Tabs defaultValue="profile">
          <TabsList className="grid grid-cols-4 md:w-[400px]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Personal Information</CardTitle>
                </div>
                <CardDescription>
                  Update your profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <Avatar className="w-24 h-24">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} />
                    ) : (
                      <AvatarFallback>JD</AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="space-y-2">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" className="inline-block" type="button">
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
                    <p className="text-xs text-muted-foreground">
                      JPG, GIF or PNG. Max size of 2MB.
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      value={formValues.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      value={formValues.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      value={formValues.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={formValues.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="farmName">Farm Name</Label>
                  <Input 
                    id="farmName" 
                    name="farmName"
                    value={formValues.farmName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="farmLocation">Farm Location</Label>
                  <Input 
                    id="farmLocation" 
                    name="farmLocation"
                    value={formValues.farmLocation}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={!formModified || isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Notification Settings</CardTitle>
                </div>
                <CardDescription>
                  Control how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Task reminders</p>
                      <p className="text-sm text-muted-foreground">Receive notifications about upcoming tasks</p>
                    </div>
                    <Switch 
                      checked={emailNotifications.tasks} 
                      onCheckedChange={() => toggleNotification("tasks")}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Community activity</p>
                      <p className="text-sm text-muted-foreground">Updates about replies and mentions</p>
                    </div>
                    <Switch 
                      checked={emailNotifications.community} 
                      onCheckedChange={() => toggleNotification("community")}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Weather alerts</p>
                      <p className="text-sm text-muted-foreground">Important weather changes affecting your farm</p>
                    </div>
                    <Switch 
                      checked={emailNotifications.weather} 
                      onCheckedChange={() => toggleNotification("weather")}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>AI insights</p>
                      <p className="text-sm text-muted-foreground">Receive AI-generated farming recommendations</p>
                    </div>
                    <Switch 
                      checked={emailNotifications.aiInsights} 
                      onCheckedChange={() => toggleNotification("aiInsights")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Privacy Settings</CardTitle>
                </div>
                <CardDescription>
                  Control your data and profile visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Visibility</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Public profile</p>
                      <p className="text-sm text-muted-foreground">Allow other farmers to view your profile</p>
                    </div>
                    <Switch 
                      checked={privacySettings.publicProfile} 
                      onCheckedChange={() => togglePrivacy("publicProfile")}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Show farm location</p>
                      <p className="text-sm text-muted-foreground">Display your farm location on your profile</p>
                    </div>
                    <Switch 
                      checked={privacySettings.showLocation} 
                      onCheckedChange={() => togglePrivacy("showLocation")}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Data usage for AI insights</p>
                      <p className="text-sm text-muted-foreground">Allow your farm data to improve AI recommendations</p>
                    </div>
                    <Switch 
                      checked={privacySettings.dataForAI} 
                      onCheckedChange={() => togglePrivacy("dataForAI")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <CardTitle>Security Settings</CardTitle>
                </div>
                <CardDescription>
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="mt-2"
                    disabled={!passwordForm.current || !passwordForm.new || !passwordForm.confirm || isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </form>
                
                <Separator className="my-4" />
                
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p>Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch 
                    checked={twoFactorEnabled}
                    onCheckedChange={toggle2FA}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
