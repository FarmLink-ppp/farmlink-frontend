
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Lightbulb
} from "lucide-react";

const Index = () => {
  const stats = [
    {
      title: "Total Plants",
      value: "2,847",
      change: "+12%",
      trend: "up" as const,
      icon: Leaf,
      color: "text-farmlink-green"
    },
    {
      title: "Healthy Plants", 
      value: "2,703",
      change: "+5%",
      trend: "up" as const,
      icon: CheckCircle,
      color: "text-farmlink-mediumgreen"
    },
    {
      title: "Active Tasks",
      value: "23",
      change: "-3",
      trend: "down" as const,
      icon: Calendar,
      color: "text-farmlink-lightgreen"
    },
    {
      title: "Community Posts",
      value: "156",
      change: "+18%",
      trend: "up" as const,
      icon: Users,
      color: "text-farmlink-darkgreen"
    },
  ];

  const dailyTip = {
    title: "Today's Farming Tip",
    content: "Water your plants early in the morning to reduce evaporation and give them the best start to the day. This helps conserve water and ensures your plants stay hydrated longer.",
    category: "Water Management"
  };

  const upcomingTasks = [
    {
      title: "Water greenhouse plants",
      time: "Today, 3:00 PM",
      priority: "high",
      category: "Irrigation"
    },
    {
      title: "Fertilize tomato plants",
      time: "Tomorrow, 8:00 AM", 
      priority: "medium",
      category: "Nutrition"
    },
    {
      title: "Inspect pest traps",
      time: "Tomorrow, 2:00 PM",
      priority: "high",
      category: "Pest Control"
    },
    {
      title: "Harvest lettuce",
      time: "Thursday, 6:00 AM",
      priority: "medium",
      category: "Harvest"
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-farmlink-green/10 to-farmlink-mediumgreen/10 rounded-2xl p-8 border border-farmlink-lightgreen/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-farmlink-darkgreen mb-2">
                Welcome back, Farmer! 🌱
              </h1>
              <p className="text-farmlink-darkgreen/70 text-lg">
                Here's what's happening on your farm today
              </p>
              <div className="inline-flex items-center mt-4 px-4 py-2 rounded-full bg-farmlink-lightgreen/20 text-farmlink-darkgreen text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                All systems optimal • Weather: Sunny 72°F
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen rounded-2xl flex items-center justify-center">
                <Target className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Daily Tip */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-farmlink-darkgreen flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-farmlink-green" />
                  {dailyTip.title}
                </CardTitle>
                <Badge variant="secondary" className="bg-farmlink-lightgreen/20 text-farmlink-darkgreen">
                  {dailyTip.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-xl bg-gradient-to-br from-farmlink-green/5 to-farmlink-mediumgreen/5 border border-farmlink-lightgreen/20">
                  <p className="text-farmlink-darkgreen/80 leading-relaxed text-lg">
                    {dailyTip.content}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="mt-4 text-farmlink-green hover:text-farmlink-mediumgreen hover:bg-farmlink-lightgreen/10"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weather Widget */}
          <div>
            <WeatherWidget />
          </div>

          {/* Upcoming Tasks */}
          <div>
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-farmlink-darkgreen flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-farmlink-green" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="p-4 rounded-xl bg-farmlink-offwhite/30 hover:bg-farmlink-offwhite/50 transition-all duration-200 group">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                          className={task.priority === 'high' ? 
                            'bg-red-100 text-red-700' : 
                            'bg-farmlink-lightgreen/20 text-farmlink-darkgreen'
                          }
                        >
                          {task.priority} priority
                        </Badge>
                        <span className="text-xs text-farmlink-darkgreen/60 font-medium">{task.category}</span>
                      </div>
                      <p className="font-semibold text-farmlink-darkgreen group-hover:text-farmlink-green transition-colors duration-200">
                        {task.title}
                      </p>
                      <p className="text-sm text-farmlink-darkgreen/70">{task.time}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white">
                  View All Tasks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

    
      </div>
    </MainLayout>
  );
};

export default Index;