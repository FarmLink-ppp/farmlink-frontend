import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
} from "lucide-react";
import { Task, TaskPriority, TaskStatus } from "@/types";

interface TaskCalendarProps {
  tasks: Task[];
  onStatusChange?: (taskId: number, newStatus: TaskStatus) => void;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({
  tasks,
  onStatusChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const getDayTasks = (day: Date) => {
    return tasks.filter(
      (task) =>
        format(new Date(task.due_date), "yyyy-MM-dd") ===
        format(day, "yyyy-MM-dd")
    );
  };

  const selectedDateTasks = selectedDate ? getDayTasks(selectedDate) : [];

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "bg-red-100 text-red-800 border-red-200";
      case TaskPriority.MEDIUM:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case TaskPriority.LOW:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case TaskStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-blue-600" />;
      case TaskStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case TaskStatus.CANCELLED:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return "bg-green-50 border-green-200";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-50 border-blue-200";
      case TaskStatus.PENDING:
        return "bg-yellow-50 border-yellow-200";
      case TaskStatus.CANCELLED:
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="mt-4 space-y-6">
      {/* Full Width Calendar Section */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-farmlink-darkgreen flex items-center text-xl">
            <CalendarDays className="w-6 h-6 mr-3 text-farmlink-green" />
            Calendar View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="p-4 pointer-events-auto bg-farmlink-offwhite/20 rounded-xl border border-farmlink-lightgreen/20 w-full"
            components={{
              DayContent: (props) => {
                const dayTasks = getDayTasks(props.date);
                const isSelected =
                  selectedDate &&
                  format(props.date, "yyyy-MM-dd") ===
                    format(selectedDate, "yyyy-MM-dd");

                return (
                  <div
                    className={`relative w-full h-full flex items-center justify-center cursor-pointer rounded-md transition-all duration-200 ${
                      isSelected
                        ? "bg-farmlink-green text-white"
                        : "hover:bg-farmlink-green/10"
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        isSelected ? "text-white" : "text-farmlink-darkgreen"
                      }`}
                    >
                      {props.date.getDate()}
                    </span>
                    {dayTasks.length > 0 && (
                      <Badge
                        variant="secondary"
                        className={`absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs border-0 font-bold ${
                          isSelected
                            ? "bg-white text-farmlink-green"
                            : "bg-farmlink-green text-white"
                        }`}
                      >
                        {dayTasks.length}
                      </Badge>
                    )}
                  </div>
                );
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Grid Layout for Cards Below Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks for Selected Date */}
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-farmlink-darkgreen flex items-center text-lg">
              <Target className="w-5 h-5 mr-2 text-farmlink-green" />
              Tasks for{" "}
              {selectedDate
                ? format(selectedDate, "MMM dd, yyyy")
                : "Selected Date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getStatusColor(
                      task.status
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <h4 className="font-semibold text-farmlink-darkgreen text-sm">
                          {task.title}
                        </h4>
                      </div>
                      <Badge
                        className={`text-xs font-medium border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-sm text-farmlink-darkgreen/70 mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-farmlink-darkgreen/60">
                      <span className="flex items-center">
                        Assigned to:{" "}
                        {task.assignments[0]?.worker?.name || "Unassigned"}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs border-farmlink-lightgreen text-farmlink-darkgreen"
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gradient-to-br from-farmlink-offwhite/30 to-white/50 rounded-xl border border-farmlink-lightgreen/20">
                <Target className="h-12 w-12 text-farmlink-green/40 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-farmlink-darkgreen mb-2">
                  No tasks found
                </h3>
                <p className="text-farmlink-darkgreen/60 text-sm">
                  No tasks are scheduled for{" "}
                  {selectedDate
                    ? format(selectedDate, "MMM dd, yyyy")
                    : "this date"}
                  .
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task Statistics for Selected Date */}
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-farmlink-darkgreen text-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-farmlink-green" />
              Day Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-farmlink-offwhite/30">
                  <span className="text-farmlink-darkgreen font-medium">
                    Total Tasks
                  </span>
                  <span className="font-bold text-farmlink-darkgreen text-lg">
                    {selectedDateTasks.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
                  <span className="text-farmlink-darkgreen font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Completed
                  </span>
                  <span className="font-bold text-green-600 text-lg">
                    {
                      selectedDateTasks.filter(
                        (t) => t.status === TaskStatus.COMPLETED
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50">
                  <span className="text-farmlink-darkgreen font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    In Progress
                  </span>
                  <span className="font-bold text-blue-600 text-lg">
                    {
                      selectedDateTasks.filter(
                        (t) => t.status === TaskStatus.IN_PROGRESS
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-50">
                  <span className="text-farmlink-darkgreen font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                    Pending
                  </span>
                  <span className="font-bold text-yellow-600 text-lg">
                    {
                      selectedDateTasks.filter(
                        (t) => t.status === TaskStatus.PENDING
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-50">
                  <span className="text-farmlink-darkgreen font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                    Cancelled
                  </span>
                  <span className="font-bold text-red-600 text-lg">
                    {
                      selectedDateTasks.filter(
                        (t) => t.status === TaskStatus.CANCELLED
                      ).length
                    }
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-gradient-to-br from-farmlink-offwhite/30 to-white/50 rounded-xl border border-farmlink-lightgreen/20">
                <CheckCircle className="h-12 w-12 text-farmlink-green/40 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-farmlink-darkgreen mb-2">
                  No summary available
                </h3>
                <p className="text-farmlink-darkgreen/60 text-sm">
                  Select a date with tasks to view the summary.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskCalendar;
