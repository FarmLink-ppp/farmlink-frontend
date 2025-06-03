
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, CalendarDays, Users, MessageSquare, CloudSun } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', crops: 40, resources: 24 },
  { name: 'Feb', crops: 30, resources: 13 },
  { name: 'Mar', crops: 20, resources: 38 },
  { name: 'Apr', crops: 27, resources: 27 },
  { name: 'May', crops: 18, resources: 33 },
  { name: 'Jun', crops: 23, resources: 43 },
];

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your FarmLink dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Crops Health" 
            value="92%" 
            icon={<Leaf className="h-5 w-5 text-primary" />} 
            trend={{ value: 3, isPositive: true }}
          />
          <StatCard 
            title="Pending Tasks" 
            value="5" 
            icon={<CalendarDays className="h-5 w-5 text-primary" />} 
            trend={{ value: 12, isPositive: false }}
          />
          <StatCard 
            title="Community Activity" 
            value="18" 
            icon={<Users className="h-5 w-5 text-primary" />} 
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard 
            title="AI Insights" 
            value="9" 
            icon={<MessageSquare className="h-5 w-5 text-primary" />} 
            trend={{ value: 24, isPositive: true }}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Farm Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="crops" 
                      stroke="#8CC63F" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="resources" 
                      stroke="#2A6C29" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Weather Forecast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <CloudSun className="h-10 w-10 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium">Today</p>
                    <p className="text-sm text-muted-foreground">Partly Cloudy</p>
                  </div>
                </div>
                <div className="text-2xl font-semibold">24°C</div>
              </div>
              
              <div className="space-y-2">
                {['Tomorrow', 'Wednesday', 'Thursday'].map((day, i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <p>{day}</p>
                    <div className="flex items-center">
                      {i === 0 ? (
                        <CloudSun className="h-5 w-5 text-blue-400 mr-2" />
                      ) : i === 1 ? (
                        <CloudSun className="h-5 w-5 text-amber-400 mr-2" />
                      ) : (
                        <CloudSun className="h-5 w-5 text-blue-500 mr-2" />
                      )}
                      <span>{22 + i}°C</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-2 border-t">
                <a href="/weather" className="text-sm text-primary hover:underline">View detailed forecast</a>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Fertilize corn field", status: "Completed", date: "Today" },
                  { title: "Water tomato section", status: "Pending", date: "Tomorrow" },
                  { title: "Check irrigation system", status: "In Progress", date: "Tomorrow" },
                  { title: "Harvest carrots", status: "Pending", date: "Wed, Apr 30" },
                ].map((task, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">Due: {task.date}</p>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded-full ${
                      task.status === "Completed" 
                        ? "bg-green-100 text-green-800" 
                        : task.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {task.status}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <a href="/tasks" className="text-sm text-primary hover:underline">View all tasks</a>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Community Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "Sarah Johnson", action: "shared a post about organic pest control" },
                  { user: "Mike Lewis", action: "asked about tomato disease prevention" },
                  { user: "Emma Davis", action: "replied to your question about soil preparation" },
                  { user: "Tom Wilson", action: "shared new photos of crop rotation results" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start border-b pb-2 last:border-0 last:pb-0">
                    <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center mr-3 mt-1">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">2h ago</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <a href="/community" className="text-sm text-primary hover:underline">View community forum</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
