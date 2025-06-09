import { apiClient } from "@/lib/api";
import { ApiErrorHandler } from "@/lib/error-handler";
import {
  CreateTaskDto,
  AssignTaskDto,
  UpdateTaskStatusDto,
  Task,
} from "@/types";
import { useEffect, useState } from "react";

interface UseTasksReturn {
  tasks: Task[];
  upcomingTasks: Task[];
  upcomingTasksCount: number;
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;

  createTask: (taskData: CreateTaskDto) => Promise<Task>;
  assignWorkerToTask: (
    taskId: number,
    assignData: AssignTaskDto
  ) => Promise<void>;
  getTasksForUser: () => Promise<void>;
  getUpcomingTasks: () => Promise<void>;
  updateTaskStatus: (
    taskId: number,
    statusData: UpdateTaskStatusDto
  ) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;

  setCurrentTask: (task: Task | null) => void;
  clearError: () => void;
  refetchTasks: () => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [upcomingTasksCount, setUpcomingTasksCount] = useState<number>(0);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    const apiError = ApiErrorHandler.handle(error);
    setError(apiError.message);
    console.error("Tasks API error:", apiError);
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getTasksForUser();
      setTasks(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpcomingTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getUpcomingTasks();
      setUpcomingTasks(response.tasks);
      setUpcomingTasksCount(response.totalCount);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.createTask(taskData);
      setTasks((prev) => [...prev, response]);
      setCurrentTask(response);
      return response;
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const assignWorkerToTask = async (
    taskId: number,
    assignData: AssignTaskDto
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const assignment = await apiClient.assignWorkerToTask(taskId, assignData);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, assignments: [...task.assignments, assignment] }
            : task
        )
      );

      if (currentTask?.id === taskId) {
        setCurrentTask({
          ...currentTask,
          assignments: [...currentTask.assignments, assignment],
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTasksForUser = async () => {
    await fetchTasks();
  };

  const getUpcomingTasks = async () => {
    await fetchUpcomingTasks();
  };

  const updateTaskStatus = async (
    taskId: number,
    statusData: UpdateTaskStatusDto
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.updateTaskStatus(taskId, statusData);

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? response : task))
      );

      if (currentTask?.id === taskId) {
        setCurrentTask(response);
      }

      setUpcomingTasks((prev) =>
        prev.map((task) => (task.id === taskId ? response : task))
      );
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.deleteTask(taskId);

      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      setUpcomingTasks((prev) => prev.filter((task) => task.id !== taskId));

      if (currentTask?.id === taskId) {
        setCurrentTask(null);
      }

      setUpcomingTasksCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchTasks = async () => {
    await Promise.all([fetchTasks(), fetchUpcomingTasks()]);
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    fetchTasks();
    fetchUpcomingTasks();
  }, []);

  return {
    tasks,
    upcomingTasks,
    upcomingTasksCount,
    currentTask,
    isLoading,
    error,

    createTask,
    assignWorkerToTask,
    getTasksForUser,
    getUpcomingTasks,
    updateTaskStatus,
    deleteTask,

    setCurrentTask,
    clearError,
    refetchTasks,
  };
};
