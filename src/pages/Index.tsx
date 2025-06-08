import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Link } from "react-router-dom";
import {
  Leaf,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  Lightbulb,
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { DailyTip, TaskPriority } from "@/types";

const Index = () => {
  const [plantCount, setPlantCount] = useState<number | null>(null);
  const [activeTaskCount, setActiveTaskCount] = useState<number | null>(null);
  const [communityPostCount, setCommunityPostCount] = useState<number | null>(
    null
  );
  const [dailyTip, setDailyTip] = useState<DailyTip | null>(null);
  const [upcomingTasks, setUpcomingTasks] = useState<
    {
      title: string;
      time: string;
      priority: TaskPriority;
    }[]
  >([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const { profile } = useUserProfile();

  useEffect(() => {
    apiClient
      .getPlantCount()
      .then(setPlantCount)
      .catch((err) => {
        console.error("Failed to fetch plant count", err);
      });

    apiClient
      .getCommunityPostCount()
      .then(setCommunityPostCount)
      .catch((err) =>
        console.error("Failed to fetch community post count", err)
      );

    apiClient
      .getDailyTip()
      .then(setDailyTip)
      .catch((err) => console.error("Failed to fetch daily tip", err));
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setTasksLoading(true);
        setTasksError(null);

        // Fetch tasks from backend
        const response = await apiClient.getUpcomingTasks();
        console.warn(response);
        setActiveTaskCount(response.totalCount);

        // Transform tasks to match your frontend format
        const formattedTasks = response.tasks.map((task) => ({
          title: task.title,
          time: formatTaskDate(new Date(task.due_date)),
          priority: task.priority,
        }));

        setUpcomingTasks(formattedTasks);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setTasksError("Failed to load tasks");
        setUpcomingTasks([]);
        setActiveTaskCount(0);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Helper function to format task dates
  const formatTaskDate = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date >= today && date < tomorrow) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (
      date >= tomorrow &&
      date < new Date(tomorrow.getTime() + 86400000)
    ) {
      return `Tomorrow, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString([], {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  console.log(dailyTip);
  console.log(profile);

  const stats = [
    {
      title: "Total Plants",
      value: plantCount ? plantCount : "N/A",
      change: "+12%",
      trend: "up" as const,
      icon: Leaf,
      color: "text-farmlink-green",
    },
    {
      title: "Healthy Plants",
      value: "N/A",
      change: "+8%",
      trend: "up" as const,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Active Tasks",
      value: activeTaskCount ? activeTaskCount : "N/A",
      change: "+5%",
      trend: "up" as const,
      icon: Calendar,
      color: "text-farmlink-lightgreen",
    },

    {
      title: "Community Posts",
      value:
        communityPostCount !== null
          ? communityPostCount.toLocaleString()
          : "...",
      change: "+18%",
      trend: "up" as const,
      icon: Users,
      color: "text-farmlink-darkgreen",
    },
  ];

  const defaultDailyTip = {
    title: "Today's Farming Tip",
    content:
      "Water your plants early in the morning to reduce evaporation and give them the best start to the day. This helps conserve water and ensures your plants stay hydrated longer.",
    category: "Water Management",
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-farmlink-green/10 to-farmlink-mediumgreen/10 rounded-2xl p-8 border border-farmlink-lightgreen/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-farmlink-darkgreen mb-2">
                Welcome back, {profile?.username || "Farmer"}! 🌱
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
                  {dailyTip ? dailyTip.title : defaultDailyTip.title}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-farmlink-lightgreen/20 text-farmlink-darkgreen"
                >
                  {dailyTip ? dailyTip.category : defaultDailyTip.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-xl bg-gradient-to-br from-farmlink-green/5 to-farmlink-mediumgreen/5 border border-farmlink-lightgreen/20">
                  <p className="text-farmlink-darkgreen/80 leading-relaxed text-lg">
                    {dailyTip ? dailyTip.content : defaultDailyTip.content}
                  </p>
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
                  {tasksLoading && (
                    <span className="ml-2 text-sm text-farmlink-darkgreen/60">
                      Loading...
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tasksError && (
                  <div className="mb-4 text-red-500 text-sm">{tasksError}</div>
                )}
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-farmlink-offwhite/30 hover:bg-farmlink-offwhite/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={
                            task.priority === TaskPriority.HIGH
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            task.priority === TaskPriority.HIGH
                              ? "bg-red-100 text-red-700"
                              : "bg-farmlink-lightgreen/20 text-farmlink-darkgreen"
                          }
                        >
                          {task.priority} priority
                        </Badge>
                      </div>
                      <p className="font-semibold text-farmlink-darkgreen group-hover:text-farmlink-green transition-colors duration-200">
                        {task.title}
                      </p>
                      <p className="text-sm text-farmlink-darkgreen/70">
                        {task.time}
                      </p>
                    </div>
                  ))}
                </div>
                <Link to="/tasks">
                  <Button className="w-full mt-6 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white">
                    View All Tasks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
