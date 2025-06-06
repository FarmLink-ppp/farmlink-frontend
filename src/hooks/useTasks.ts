import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/pages/Tasks";
import { useToast } from "@/components/ui/use-toast";

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: 1,
    title: "Fertilize corn field",
    description: "Apply nitrogen fertilizer to the north corn field. Use 150 lbs per acre and ensure even distribution across the entire field.",
    assignee: { name: "John Smith" },
    dueDate: "2024-06-10",
    priority: "high",
    status: "pending"
  },
  {
    id: 2,
    title: "Inspect greenhouse vents",
    description: "Check all greenhouse ventilation systems for proper operation and clean any debris from vents.",
    assignee: { name: "Sarah Johnson" },
    dueDate: "2024-06-08",
    priority: "medium",
    status: "in-progress"
  },
  {
    id: 3,
    title: "Order new seeds",
    description: "Purchase tomato and pepper seeds for next season planting. Check inventory levels first.",
    assignee: { name: "Mike Wilson" },
    dueDate: "2024-06-05",
    priority: "low",
    status: "completed"
  },
  {
    id: 4,
    title: "Repair irrigation system",
    description: "Fix broken sprinkler heads in section B of the irrigation system. Replace damaged pipes if necessary.",
    assignee: { name: "Emma Davis" },
    dueDate: "2024-06-12",
    priority: "high",
    status: "pending"
  },
  {
    id: 5,
    title: "Harvest lettuce crop",
    description: "Harvest the lettuce in greenhouse 2. Quality check each batch before packaging.",
    assignee: { name: "John Smith" },
    dueDate: "2024-06-06",
    priority: "medium",
    status: "in-progress"
  }
];

let tasksData = [...mockTasks];
let nextId = 6;

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => Promise.resolve(tasksData),
  });
};

export const useTasksDueToday = () => {
  return useQuery({
    queryKey: ['tasks', 'today'],
    queryFn: () => {
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = tasksData.filter(task => task.dueDate === today);
      return Promise.resolve(todayTasks);
    },
  });
};

export const useTasksByStatus = (status: "pending" | "in-progress" | "completed") => {
  return useQuery({
    queryKey: ['tasks', 'status', status],
    queryFn: () => {
      const statusTasks = tasksData.filter(task => task.status === status);
      return Promise.resolve(statusTasks);
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (taskData: {
      title: string;
      description: string;
      dueDate: string;
      priority: "low" | "medium" | "high";
      status?: "pending" | "in-progress" | "completed";
      assigneeName: string;
    }) => {
      const newTask: Task = {
        id: nextId++,
        title: taskData.title,
        description: taskData.description,
        assignee: { name: taskData.assigneeName },
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status || "pending"
      };
      tasksData.push(newTask);
      return Promise.resolve(newTask);
    },
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task Created",
        description: `"${newTask.title}" has been assigned to ${newTask.assignee.name}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
      console.error('Create task error:', error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ taskId, updateData }: { 
      taskId: number; 
      updateData: {
        title?: string;
        description?: string;
        dueDate?: string;
        priority?: "low" | "medium" | "high";
      };
    }) => {
      const taskIndex = tasksData.findIndex(task => task.id === taskId);
      if (taskIndex === -1) throw new Error('Task not found');
      
      tasksData[taskIndex] = { ...tasksData[taskIndex], ...updateData };
      return Promise.resolve(tasksData[taskIndex]);
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task Updated",
        description: `"${updatedTask.title}" has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
      console.error('Update task error:', error);
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: "pending" | "in-progress" | "completed" }) => {
      const taskIndex = tasksData.findIndex(task => task.id === taskId);
      if (taskIndex === -1) throw new Error('Task not found');
      
      tasksData[taskIndex].status = status;
      return Promise.resolve(tasksData[taskIndex]);
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task Updated",
        description: `"${updatedTask.title}" status changed to ${updatedTask.status.replace('-', ' ')}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
      console.error('Update task status error:', error);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (taskId: number) => {
      const taskIndex = tasksData.findIndex(task => task.id === taskId);
      if (taskIndex === -1) throw new Error('Task not found');
      
      tasksData.splice(taskIndex, 1);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task Deleted",
        description: "Task has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
      console.error('Delete task error:', error);
    },
  });
};