import React, { useState } from "react";
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
import { CalendarDays, Filter, Plus, CheckCircle, Clock, AlertTriangle, Target, Zap } from "lucide-react";
import TaskCalendar from "@/components/tasks/TaskCalendar";
import { useTasks, useCreateTask, useUpdateTaskStatus } from "@/hooks/useTasks";
import { useWorkers } from "@/hooks/useWorkers";
import { CreateTaskDto, TaskPriority } from "@/types/task";
import {apiClient} from "@/lib/api"; // Adjust the import based on your project structure
import { Task } from "@/types/task";

const Tasks = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newTask, setNewTask] = useState<CreateTaskDto>({
  title: "",
  description: "",
  priority: TaskPriority.MEDIUM, // default
  startDate: new Date().toISOString(), // default to today
  dueDate: "", 
  landDivisionId: undefined,
});
const [assigneeId, setAssigneeId] = useState<number | undefined>(undefined);

  const [filterPriority, setFilterPriority] = useState("all");

  // Use React Query hooks
  const { data: tasks = [], isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskStatusMutation = useUpdateTaskStatus();
  
  // Get workers for assignment
  const { workers: availableWorkers } = useWorkers();

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

  // const handleCreateTask = () => {
  //   if (!newTask.title || !newTask.description || !newTask.dueDate || !newTask.assignee || !newTask.priority) {
  //     return;
  //   }

  //   createTaskMutation.mutate({
  //     title: newTask.title,
  //     description: newTask.description,
  //     dueDate: newTask.dueDate,
  //     priority: newTask.priority as "low" | "medium" | "high",
  //     status: newTask.status as "pending" | "in-progress" | "completed",
  //     assigneeName: newTask.assignee,
  //   }, {
  //     onSuccess: () => {
  //       setNewTask({
  //         title: "",
  //         description: "",
  //         dueDate: "",
  //         assignee: "",
  //         priority: "",
  //         status: "pending",
  //       });
  //       setIsDialogOpen(false);
  //     }
  //   });
  // };
const handleCreateTask = async () => {
  try {
    // Optionally validate dates here
    // if (new Date(newTask.startDate) > new Date(newTask.dueDate)) {
    //   alert("Start date cannot be after due date.");
    //   return;
    // }
    const createdTask = await apiClient.createTask(newTask);
    console.log("Created task:", createdTask);
// Step 2: Assign worker if selected
    if (assigneeId) {
      await apiClient.assignWorkerToTask("5", { workerId: 2 });
    }
    // Optional: Reset form or show success message
    console.log("Task created and assigned successfully!");
    // Reset form
    setNewTask({
      title: "",
      description: "",
      priority: TaskPriority.MEDIUM,
      startDate: new Date().toISOString(), 
      dueDate: "",
      landDivisionId: undefined,
    });

    // Optionally refresh task list or close modal
  } catch (error) {
    console.error("Error creating task:", error);
    alert("Failed to create task. Please try again.");
  }
};

  const handleStatusChange = (taskId: number, newStatus: "pending" | "in-progress" | "completed") => {
    updateTaskStatusMutation.mutate({ taskId, status: newStatus });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farmlink-green mx-auto mb-4"></div>
            <p className="text-farmlink-darkgreen">Loading tasks...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-farmlink-darkgreen">Failed to load tasks. Please try again.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const renderTaskContent = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
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
              <div className="text-center p-12 bg-gradient-to-br from-farmlink-offwhite/50 to-white rounded-2xl border border-farmlink-lightgreen/20 shadow-lg">
                <Target className="h-16 w-16 text-farmlink-green/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-farmlink-darkgreen mb-2">No tasks found</h3>
                <p className="text-farmlink-darkgreen/70 mb-6">No tasks match your current filters.</p>
                <Button 
                  variant="outline" 
                  className="border-farmlink-green text-farmlink-green hover:bg-farmlink-green hover:text-white"
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
          <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-farmlink-darkgreen flex items-center">
                <Zap className="w-5 h-5 mr-2 text-farmlink-green" />
                Task Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-farmlink-offwhite/30">
                  <span className="text-farmlink-darkgreen font-medium">Total Tasks</span>
                  <span className="font-bold text-farmlink-darkgreen text-lg">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-green-50">
                  <span className="text-farmlink-darkgreen font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Completed
                  </span>
                  <span className="font-bold text-green-600 text-lg">{tasks.filter(t => t.status === "completed").length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50">
                  <span className="text-farmlink-darkgreen font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    In Progress
                  </span>
                  <span className="font-bold text-blue-600 text-lg">{tasks.filter(t => t.status === "in-progress").length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-yellow-50">
                  <span className="text-farmlink-darkgreen font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                    Pending
                  </span>
                  <span className="font-bold text-yellow-600 text-lg">{tasks.filter(t => t.status === "pending").length}</span>
                </div>
                <div className="pt-3 border-t border-farmlink-lightgreen/20">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-red-50">
                    <span className="text-farmlink-darkgreen font-medium flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                      High Priority
                    </span>
                    <span className="text-red-600 font-bold text-lg">{tasks.filter(t => t.priority === "high").length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-farmlink-darkgreen flex items-center">
                <Filter className="w-5 h-5 mr-2 text-farmlink-green" />
                Filter by Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="border-farmlink-lightgreen/30 focus:border-farmlink-green">
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
          
          <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-farmlink-darkgreen">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Task completed", task: "Fertilize corn field", user: "John", time: "2 hours ago" },
                  { action: "Task created", task: "Inspect greenhouse vents", user: "Sarah", time: "Yesterday" },
                  { action: "Task updated", task: "Order new seeds", user: "Mike", time: "Yesterday" },
                ].map((activity, i) => (
                  <div key={i} className="border-b border-farmlink-lightgreen/20 pb-3 last:border-0 last:pb-0">
                    <p className="text-farmlink-darkgreen">
                      <span className="font-semibold">{activity.action}:</span>{" "}
                      <span className="text-farmlink-darkgreen/80">{activity.task}</span>
                    </p>
                    <p className="text-xs text-farmlink-darkgreen/60 mt-1">
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
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-farmlink-green/10 to-farmlink-mediumgreen/10 rounded-2xl p-8 border border-farmlink-lightgreen/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-farmlink-darkgreen flex items-center mb-2">
                <CalendarDays className="mr-3 h-8 w-8 text-farmlink-green" />
                Task Management
              </h1>
              <p className="text-farmlink-darkgreen/70 text-lg">
                Plan, assign, and track your farming activities efficiently
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="border-0 bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-farmlink-darkgreen text-xl">Create New Task</DialogTitle>
                  <DialogDescription className="text-farmlink-darkgreen/70">
                    Add details for the new farming task.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-farmlink-darkgreen font-medium">Task Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter task name"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-farmlink-darkgreen font-medium">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter task details"
                      className="resize-none border-farmlink-lightgreen/30 focus:border-farmlink-green"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dueDate" className="text-farmlink-darkgreen font-medium">Due Date</Label>
                      <Input 
                        id="dueDate" 
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: new Date(e.target.value).toISOString(),})}
                        className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignee" className="text-farmlink-darkgreen font-medium">Assign To</Label>
                      <Select 
                        value={assigneeId?.toString() || ""}
                        onValueChange={(value) => setAssigneeId(Number(value))}
                      >
                        <SelectTrigger id="assignee" className="border-farmlink-lightgreen/30 focus:border-farmlink-green">
                          <SelectValue placeholder="Select worker" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableWorkers.map((worker) => (
                            <SelectItem key={worker.id} value={worker.id.toString()}>
                              {worker.name} - {worker.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-farmlink-darkgreen font-medium">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({...newTask, priority: value as TaskPriority})}
                      >
                        <SelectTrigger id="priority" className="border-farmlink-lightgreen/30 focus:border-farmlink-green">
                          <SelectValue placeholder="Set priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                          <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                          <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="status" className="text-farmlink-darkgreen font-medium">Status</Label>
                      <Select
                        value={newTask.status}
                        onValueChange={(value) => setNewTask({...newTask, status: value as "pending" | "in-progress" | "completed"})}
                      >
                        <SelectTrigger id="status" className="border-farmlink-lightgreen/30 focus:border-farmlink-green">
                          <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-farmlink-lightgreen text-farmlink-darkgreen hover:bg-farmlink-offwhite">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateTask} 
                    disabled={createTaskMutation.isPending}
                    className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white"
                  >
                    {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList className="bg-white/70 backdrop-blur-sm border border-farmlink-lightgreen/30">
              <TabsTrigger value="all" className="data-[state=active]:bg-farmlink-green data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-farmlink-green data-[state=active]:text-white">Pending</TabsTrigger>
              <TabsTrigger value="in-progress" className="data-[state=active]:bg-farmlink-green data-[state=active]:text-white">In Progress</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-farmlink-green data-[state=active]:text-white">Completed</TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-farmlink-green data-[state=active]:text-white">Calendar</TabsTrigger>
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