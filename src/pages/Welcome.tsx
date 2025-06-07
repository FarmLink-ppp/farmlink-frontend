
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Leaf, 
  Users, 
  CloudSun, 
  MessageSquare, 
  Calendar, 
  Crop, 
  CheckCircle, 
  Star, 
  TrendingUp,
  ArrowRight,
  Play,
  Sparkles,
  Globe
} from "lucide-react";

const Welcome = () => {
  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-farmlink-green" />,
      title: "AI Plant Health Monitoring",
      description: "Upload photos and get instant AI-powered diagnosis with 95% accuracy. Detect diseases early and get personalized treatment plans.",
      badge: "AI-Powered"
    },
    {
      icon: <Users className="h-8 w-8 text-farmlink-mediumgreen" />,
      title: "Global Farmer Network",
      description: "Connect with 50,000+ farmers worldwide. Share knowledge, get expert advice, and learn from the best in agriculture.",
      badge: "Community"
    },
    {
      icon: <CloudSun className="h-8 w-8 text-farmlink-lightgreen" />,
      title: "Hyper-Local Weather Intelligence",
      description: "Get precise weather forecasts for your exact location with climate-smart farming recommendations.",
      badge: "Smart Weather"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-farmlink-green" />,
      title: "24/7 AI Farm Assistant",
      description: "Chat with our specialized agricultural AI trained on decades of farming knowledge from around the world.",
      badge: "Always Available"
    },
    {
      icon: <Calendar className="h-8 w-8 text-farmlink-mediumgreen" />,
      title: "Smart Task Automation",
      description: "Never miss critical farming activities with intelligent scheduling and automated reminders.",
      badge: "Automated"
    },
    {
      icon: <Crop className="h-8 w-8 text-farmlink-lightgreen" />,
      title: "Precision Land Management",
      description: "Visualize your farm with satellite imagery, optimize field rotations, and plan expansions with AI insights.",
      badge: "Precision Farming"
    }
  ];

  const benefits = [
    { icon: <TrendingUp className="h-5 w-5" />, text: "Increase crop yield by up to 30% with AI-powered insights" },
    { icon: <Leaf className="h-5 w-5" />, text: "Reduce chemical usage through precise disease detection" },
    { icon: <Calendar className="h-5 w-5" />, text: "Save 5+ hours weekly with automated task management" },
    { icon: <Users className="h-5 w-5" />, text: "Connect with agricultural experts and local farmers" },
    { icon: <Globe className="h-5 w-5" />, text: "Access weather data tailored to your exact location" },
    { icon: <Sparkles className="h-5 w-5" />, text: "Make data-driven decisions for sustainable farming" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Iowa, USA",
      text: "FarmLink's AI detected a pest problem that would have cost me my entire harvest. The precision is incredible!",
      rating: 5,
      avatar: "SJ",
      crop: "Corn & Soybeans"
    },
    {
      name: "Miguel Rodriguez",
      location: "Sonora, Mexico",
      text: "The weather intelligence saved my tomato crop three times this season. It's like having a meteorologist on-site.",
      rating: 5,
      avatar: "MR",
      crop: "Tomatoes"
    },
    {
      name: "Chen Wei",
      location: "Shandong, China",
      text: "The community feature connected me with experts who helped me transition to organic farming successfully.",
      rating: 5,
      avatar: "CW",
      crop: "Vegetables"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmlink-offwhite via-white to-farmlink-offwhite">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-farmlink-lightgreen/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="/uploads/logo.png"
                  alt="FarmLink Logo"
                  className="w-10 h-10 object-contain"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-farmlink-green rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-farmlink-darkgreen to-farmlink-green bg-clip-text text-transparent">
                FarmLink
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-farmlink-darkgreen hover:text-farmlink-green hover:bg-farmlink-offwhite/50">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 lg:py-32 bg-[url('public/uploads/hero.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-farmlink-lightgreen/20 text-farmlink-darkgreen text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by 50,000+ farmers worldwide
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-farmlink-darkgreen mb-6 leading-tight">
              The Future of
              <span className="block bg-gradient-to-r from-farmlink-green via-farmlink-mediumgreen to-farmlink-lightgreen bg-clip-text text-transparent">
                Smart Farming
              </span>
            </h1>
            
           <p className="text-2xl lg:text-2xl text-farmlink-darkgreen/70  mb-10 leading-relaxed max-w-3xl mx-auto fontbold">
  Harness the power of AI to increase yields, reduce costs, and build sustainable agricultural practices. 
  Join the farming revolution that's transforming agriculture globally.
</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-farmlink-green hover:border-farmlink-mediumgreen text-farmlink-darkgreen hover:text-farmlink-green px-8 py-4 text-lg bg-white/50 backdrop-blur-sm">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo (2 min)
              </Button>
            </div>
            
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Active Farmers", color: "text-farmlink-green" },
              { number: "2M+", label: "Plants Diagnosed", color: "text-farmlink-mediumgreen" },
              { number: "120+", label: "Countries", color: "text-farmlink-lightgreen" },
              { number: "30%", label: "Avg. Yield Increase", color: "text-farmlink-darkgreen" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`text-4xl lg:text-5xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-200`}>
                  {stat.number}
                </div>
                <div className="text-farmlink-darkgreen/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-farmlink-darkgreen mb-6">
              Powerful Tools for Modern Farmers
            </h2>
            <p className="text-xl text-farmlink-darkgreen/70 max-w-3xl mx-auto">
              From AI-powered plant diagnosis to global community insights, 
              everything you need to farm smarter and more sustainably.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-farmlink-offwhite to-farmlink-lightgreen/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-farmlink-lightgreen/20 to-farmlink-mediumgreen/20 text-farmlink-darkgreen text-xs font-semibold mb-3">
                    {feature.badge}
                  </div>
                  <CardTitle className="text-farmlink-darkgreen text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-farmlink-darkgreen/70 text-center leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-farmlink-lightgreen/10 to-farmlink-mediumgreen/10">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl lg:text-4xl font-bold text-farmlink-darkgreen text-center mb-16">
            Why Farmers Choose FarmLink
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 rounded-2xl bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-200">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen rounded-xl flex items-center justify-center text-white">
                  {benefit.icon}
                </div>
                <p className="text-farmlink-darkgreen text-lg font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl lg:text-4xl font-bold text-farmlink-darkgreen text-center mb-16">
            Loved by Farmers Worldwide
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-farmlink-lightgreen fill-current" />
                    ))}
                  </div>
                  <p className="text-farmlink-darkgreen/80 mb-6 italic text-lg leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-farmlink-darkgreen">{testimonial.name}</p>
                      <p className="text-farmlink-darkgreen/60 text-sm">{testimonial.location}</p>
                      <p className="text-farmlink-green text-sm font-medium">{testimonial.crop}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:py-32 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Farm?
          </h3>
          <p className="text-xl text-farmlink-offwhite mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of farmers who have revolutionized their operations with FarmLink. 
            Start your free trial today and experience the future of farming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-farmlink-green hover:bg-farmlink-offwhite px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                Start Your Free Trial Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
           
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="px-6 py-16 bg-farmlink-darkgreen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="/uploads/logo.png"
                  alt="FarmLink Logo"
                  className="w-8 h-8 object-contain"
                />
                <h4 className="text-white font-bold text-xl">FarmLink</h4>
              </div>
              <p className="text-farmlink-offwhite/80 leading-relaxed">
                Empowering farmers worldwide with cutting-edge AI technology and community-driven insights.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Plant Health", "Weather Intelligence", "Community", "AI Assistant", "Land Management"]
              },
              {
                title: "Support",
                links: ["Help Center", "Contact Us", "Training", "API Documentation", "Status Page"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Privacy Policy", "Terms of Service", "Blog"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h5 className="text-white font-semibold mb-4 text-lg">{section.title}</h5>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-farmlink-offwhite/70 hover:text-farmlink-lightgreen transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
    
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;