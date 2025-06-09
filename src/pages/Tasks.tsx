import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Zap,
} from "lucide-react";
import TaskCalendar from "@/components/tasks/TaskCalendar";
import { CreateTaskDto, TaskPriority, TaskStatus } from "@/types";
import { apiClient } from "@/lib/api";
import { FarmerWorker } from "@/pages/Workers";
import { toast } from "sonner";
import { useTasks } from "@/hooks/useTasks";

const Tasks = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workers, setWorkers] = useState<FarmerWorker[]>([]);
  const [workersLoading, setWorkersLoading] = useState(true);
  const [newTask, setNewTask] = useState<CreateTaskDto>({
    title: "",
    description: "",
    priority: TaskPriority.MEDIUM,
    startDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    landDivisionId: undefined,
  });

  console.log("iso string date", newTask.dueDate);
  const [assigneeId, setAssigneeId] = useState<number | undefined>(undefined);

  const [filterPriority, setFilterPriority] = useState<TaskPriority | "ALL">(
    "ALL"
  );

  const {
    tasks,
    isLoading,
    error,
    createTask,
    assignWorkerToTask,
    updateTaskStatus,
    refetchTasks,
  } = useTasks();

  useEffect(() => {
    apiClient
      .getWorkersByEmployer()
      .then((data) => {
        const mapped: FarmerWorker[] = data.map((w: any) => ({
          id: w.id, // ✅ Ensure the original object has an `id`
          name: w.name,
          contact: w.contact,
          employment_status: w.employment_status,
          created_at: w.created_at,
          updated_at: w.updated_at,
          employerId: w.employerId,
          email: `${w.name.replace(/\s+/g, ".").toLowerCase()}@farm.com`,
          phone: w.contact,
          position: "Farm Worker",
          hireDate: new Date(w.created_at).toISOString().split("T")[0],
          status: w.employment_status === "ACTIVE" ? "active" : "inactive",
          address: "", // You can populate this later if needed
          image_url: w.image_url,
          imageUrl: w.image_url, // Support both camel and snake if needed
        }));
        setWorkers(mapped);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load workers.");
      })
      .finally(() => setWorkersLoading(false));
  }, []);

  const getStatusFromTab = (tabValue: string): TaskStatus | null => {
    const statusMap: { [key: string]: TaskStatus } = {
      PENDING: TaskStatus.PENDING,
      IN_PROGRESS: TaskStatus.IN_PROGRESS,
      COMPLETED: TaskStatus.COMPLETED,
      CANCELLED: TaskStatus.CANCELLED,
    };
    return statusMap[tabValue] || null;
  };

  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      const priorityMatches =
        filterPriority === "ALL" || filterPriority === task.priority;

      if (activeTab === "ALL" || activeTab === "CALENDAR") {
        return priorityMatches;
      }

      const expectedStatus = getStatusFromTab(activeTab);
      const statusMatches = expectedStatus
        ? task.status === expectedStatus
        : false;

      return statusMatches && priorityMatches;
    });
  };

  const filteredTasks = getFilteredTasks();

  const handleCreateTask = async () => {
    try {
      const createdTask = await createTask(newTask);
      await refetchTasks();

      if (assigneeId) {
        await assignWorkerToTask(createdTask.id, { workerId: assigneeId });
      }

      toast.success("Task created successfully!");

      setNewTask({
        title: "",
        description: "",
        priority: TaskPriority.MEDIUM,
        startDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        landDivisionId: null,
      });

      setAssigneeId(undefined);
      setIsDialogOpen(false);
      await refetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, {
        status: newStatus,
      });
      toast.success("Task status updated successfully!");
      //  await refetchTasks();
      // Reload the page to ensure everything is updated
    window.location.reload();

    } catch (error) {
      console.error("Status update failed", error);
      toast.error("Failed to update task status. Please try again.");
    }
  };

  if (isLoading || workersLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Clock className="h-12 w-12 text-farmlink-green mx-auto mb-4 animate-spin" />
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
            <p className="text-farmlink-darkgreen mb-4">{error}</p>
            <Button
              onClick={() => refetchTasks()}
              className="bg-farmlink-green hover:bg-farmlink-mediumgreen text-white"
            >
              Try Again
            </Button>
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
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  assignee={{
                    name: task.assignments[0]?.worker?.name || "Unassigned",
                  }}
                  dueDate={task.due_date.split("T")[0]}
                  priority={task.priority}
                  status={task.status}
                  onStatusChange={(newStatus) =>
                    handleStatusChange(task.id, newStatus)
                  }
                />
              ))
            ) : (
              <div className="text-center p-12 bg-gradient-to-br from-farmlink-offwhite/50 to-white rounded-2xl border border-farmlink-lightgreen/20 shadow-lg">
                <Target className="h-16 w-16 text-farmlink-green/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-farmlink-darkgreen mb-2">
                  No tasks found
                </h3>
                <p className="text-farmlink-darkgreen/70 mb-6">
                  No tasks match your current filters.
                </p>
                <Button
                  variant="outline"
                  className="border-farmlink-green text-farmlink-green hover:bg-farmlink-green hover:text-white"
                  onClick={() => {
                    setActiveTab("ALL");
                    setFilterPriority("ALL");
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
                  <span className="text-farmlink-darkgreen font-medium">
                    Total Tasks
                  </span>
                  <span className="font-bold text-farmlink-darkgreen text-lg">
                    {tasks.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-green-50">
                  <span className="text-farmlink-darkgreen font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Completed
                  </span>
                  <span className="font-bold text-green-600 text-lg">
                    {
                      tasks.filter((t) => t.status === TaskStatus.COMPLETED)
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50">
                  <span className="text-farmlink-darkgreen font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    In Progress
                  </span>
                  <span className="font-bold text-blue-600 text-lg">
                    {
                      tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS)
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-yellow-50">
                  <span className="text-farmlink-darkgreen font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                    Pending
                  </span>
                  <span className="font-bold text-yellow-600 text-lg">
                    {
                      tasks.filter((t) => t.status === TaskStatus.PENDING)
                        .length
                    }
                  </span>
                </div>

                <div className="pt-3 border-t border-farmlink-lightgreen/20">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-red-50">
                    <span className="text-farmlink-darkgreen font-medium flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                      High Priority
                    </span>
                    <span className="text-red-600 font-bold text-lg">
                      {
                        tasks.filter((t) => t.priority === TaskPriority.HIGH)
                          .length
                      }
                    </span>
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
              <Select
                value={filterPriority}
                onValueChange={(value) =>
                  setFilterPriority(value as TaskPriority | "ALL")
                }
              >
                <SelectTrigger className="border-farmlink-lightgreen/30 focus:border-farmlink-green">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priorities</SelectItem>
                  <SelectItem value={TaskPriority.HIGH}>
                    High Priority
                  </SelectItem>
                  <SelectItem value={TaskPriority.MEDIUM}>
                    Medium Priority
                  </SelectItem>
                  <SelectItem value={TaskPriority.LOW}>Low Priority</SelectItem>
                </SelectContent>
              </Select>
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
                  <DialogTitle className="text-farmlink-darkgreen text-xl">
                    Create New Task
                  </DialogTitle>
                  <DialogDescription className="text-farmlink-darkgreen/70">
                    Add details for the new farming task.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-farmlink-darkgreen font-medium"
                    >
                      Task Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter task name"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-farmlink-darkgreen font-medium"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Enter task details"
                      className="resize-none border-farmlink-lightgreen/30 focus:border-farmlink-green"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="dueDate"
                        className="text-farmlink-darkgreen font-medium"
                      >
                        Due Date
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate.split("T")[0]}
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          const isoDate = selectedDate
                            ? `${selectedDate}T00:00:00.000Z`
                            : new Date().toISOString();
                          setNewTask({
                            ...newTask,
                            dueDate: isoDate,
                          });
                        }}
                        className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="assignee"
                        className="text-farmlink-darkgreen font-medium"
                      >
                        Assign To
                      </Label>
                      <Select
                        value={assigneeId?.toString() || ""}
                        onValueChange={(value) => setAssigneeId(Number(value))}
                      >
                        <SelectTrigger
                          id="assignee"
                          className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
                        >
                          <SelectValue placeholder="Select worker" />
                        </SelectTrigger>
                        <SelectContent>
                          {workers.map((worker) => (
                            <SelectItem
                              key={worker.id}
                              value={worker.id.toString()}
                            >
                              {worker.name} - {worker.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="priority"
                        className="text-farmlink-darkgreen font-medium"
                      >
                        Priority
                      </Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: TaskPriority) =>
                          setNewTask({
                            ...newTask,
                            priority: value,
                          })
                        }
                      >
                        <SelectTrigger
                          id="priority"
                          className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
                        >
                          <SelectValue placeholder="Set priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                          <SelectItem value={TaskPriority.MEDIUM}>
                            Medium
                          </SelectItem>
                          <SelectItem value={TaskPriority.HIGH}>
                            High
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-farmlink-lightgreen text-farmlink-darkgreen hover:bg-farmlink-offwhite"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTask}
                    className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white"
                  >
                    Create Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList className="bg-white/70 backdrop-blur-sm border border-farmlink-lightgreen/30">
              {[
                { value: "ALL", label: "All" },
                { value: "PENDING", label: "Pending" },
                { value: "IN_PROGRESS", label: "In Progress" },
                { value: "COMPLETED", label: "Completed" },
                { value: "CANCELLED", label: "Cancelled" },
                { value: "CALENDAR", label: "Calendar" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-farmlink-green data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="CALENDAR" className="mt-6">
            <TaskCalendar tasks={tasks} />
          </TabsContent>

          <TabsContent value="ALL" className="mt-6">
            {renderTaskContent()}
          </TabsContent>
          {Object.values(TaskStatus).map((status) => (
            <TabsContent key={status} value={status} className="mt-6">
              {renderTaskContent()}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tasks;
