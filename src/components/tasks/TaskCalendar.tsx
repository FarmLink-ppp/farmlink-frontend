
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
}

interface TaskCalendarProps {
  tasks: Task[];
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks }) => {
  const getDayTasks = (day: Date) => {
    return tasks.filter(
      (task) => format(new Date(task.dueDate), "MMM dd, yyyy") === format(day, "MMM dd, yyyy")
    );
  };

  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            className="p-3 pointer-events-auto"
            components={{
              DayContent: (props) => {
                const dayTasks = getDayTasks(props.date);
                if (dayTasks.length === 0) return <span>{props.date.getDate()}</span>;

                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span>{props.date.getDate()}</span>
                        <Badge
                          variant="secondary"
                          className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                        >
                          {dayTasks.length}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        {dayTasks.map((task) => (
                          <div key={task.id}>
                            <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                              {task.title}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCalendar;
