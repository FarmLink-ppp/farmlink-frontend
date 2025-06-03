
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import TaskCard from "@/components/tasks/TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Filter, Plus } from "lucide-react";
import TaskCalendar from "@/components/tasks/TaskCalendar";
import { useToast } from "@/components/ui/use-toast";

export interface Task {
  id: number;
  title: string;
  description: string;
  assignee: { name: string };
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
}

const mockTasks = [
  {
    id: 1,
    title: "Fertilize corn field",
    description: "Apply organic fertilizer to the east corn field. Follow the recommended dosage of 2kg per acre.",
    assignee: { name: "John" },
    dueDate: "Apr 28, 2025",
    priority: "high" as const,
    status: "completed" as const,
  },
  {
    id: 2,
    title: "Water tomato section",
    description: "Water the tomato section in the greenhouse. Check for any signs of disease while watering.",
    assignee: { name: "Sarah" },
    dueDate: "Apr 29, 2025",
    priority: "medium" as const,
    status: "pending" as const,
  },
  {
    id: 3,
    title: "Check irrigation system",
    description: "Inspect the drip irrigation system for leaks and blockages. Repair any damaged parts.",
    assignee: { name: "Mike" },
    dueDate: "Apr 29, 2025",
    priority: "high" as const,
    status: "in-progress" as const,
  },
  {
    id: 4,
    title: "Harvest carrots",
    description: "Harvest carrots from the north field. Sort and prepare them for market delivery on Thursday.",
    assignee: { name: "Emma" },
    dueDate: "Apr 30, 2025",
    priority: "medium" as const,
    status: "pending" as const,
  },
  {
    id: 5,
    title: "Repair tractor",
    description: "Fix the hydraulic system on the John Deere tractor. Parts have been ordered and will arrive tomorrow.",
    assignee: { name: "Tom" },
    dueDate: "May 2, 2025",
    priority: "low" as const,
    status: "pending" as const,
  },
];

const Tasks = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
    priority: "",
    status: "pending",
  });
  const [filterPriority, setFilterPriority] = useState("all");
  const { toast } = useToast();

  // Function to filter tasks based on the active tab and priority filter
  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      // First filter by tab (status)
      const statusMatches = 
        activeTab === "all" || 
        activeTab === task.status || 
        (activeTab === "calendar" ? true : false);
      
      // Then filter by priority if it's set
      const priorityMatches =
        filterPriority === "all" ||
        filterPriority === task.priority;
        
      return statusMatches && priorityMatches;
    });
  };

  const filteredTasks = getFilteredTasks();

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description || !newTask.dueDate || !newTask.assignee || !newTask.priority) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      dueDate: formatDate(newTask.dueDate),
      assignee: { name: newTask.assignee },
      priority: newTask.priority as "low" | "medium" | "high",
      status: newTask.status as "pending" | "in-progress" | "completed",
    };

    setTasks([task, ...tasks]);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      assignee: "",
      priority: "",
      status: "pending",
    });
    
    toast({
      title: "Task Created",
      description: `"${task.title}" has been added to your tasks.`,
    });
    
    setIsDialogOpen(false);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleStatusChange = (taskId: number, newStatus: "pending" | "in-progress" | "completed") => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus } 
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: "Task Updated",
        description: `"${task.title}" status changed to ${newStatus.replace('-', ' ')}.`,
      });
    }
  };

  const renderTaskContent = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredTasks.length > 0 ? filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                assignee={task.assignee}
                dueDate={task.dueDate}
                priority={task.priority}
                status={task.status}
                onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
              />
            )) : (
              <div className="text-center p-8 bg-secondary rounded-lg">
                <p>No tasks found in this category.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setActiveTab("all");
                    setFilterPriority("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Tasks</span>
                  <span className="font-semibold">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completed</span>
                  <span className="font-semibold">{tasks.filter(t => t.status === "completed").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>In Progress</span>
                  <span className="font-semibold">{tasks.filter(t => t.status === "in-progress").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending</span>
                  <span className="font-semibold">{tasks.filter(t => t.status === "pending").length}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span>High Priority</span>
                    <span className="text-red-500 font-semibold">{tasks.filter(t => t.priority === "high").length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Filter by Priority</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Task completed", task: "Fertilize corn field", user: "John", time: "2 hours ago" },
                  { action: "Task created", task: "Inspect greenhouse vents", user: "Sarah", time: "Yesterday" },
                  { action: "Task updated", task: "Order new seeds", user: "Mike", time: "Yesterday" },
                ].map((activity, i) => (
                  <div key={i} className="border-b pb-2 last:border-0 last:pb-0">
                    <p>
                      <span className="font-medium">{activity.action}:</span>{" "}
                      {activity.task}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      By {activity.user} • {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <CalendarDays className="mr-2 h-7 w-7 text-farmlink-green" />
              Task Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Plan, assign, and track your farming activities
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add details for the new farming task.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter task name"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task details"
                    className="resize-none"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input 
                      id="dueDate" 
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignee">Assign To</Label>
                    <Select 
                      value={newTask.assignee}
                      onValueChange={(value) => setNewTask({...newTask, assignee: value})}
                    >
                      <SelectTrigger id="assignee">
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="John">John</SelectItem>
                        <SelectItem value="Sarah">Sarah</SelectItem>
                        <SelectItem value="Mike">Mike</SelectItem>
                        <SelectItem value="Emma">Emma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({...newTask, priority: value})}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Set priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newTask.status}
                      onValueChange={(value) => setNewTask({...newTask, status: value as "pending" | "in-progress" | "completed"})}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Set status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>
                  Create Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="calendar" className="mt-6">
            <TaskCalendar tasks={tasks} />
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            {renderTaskContent()}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {renderTaskContent()}
          </TabsContent>

          <TabsContent value="in-progress" className="mt-6">
            {renderTaskContent()}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {renderTaskContent()}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tasks;
