
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
import { CalendarDays } from "lucide-react";

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
            className="p-4 pointer-events-auto bg-farmlink-offwhite/20 rounded-xl border border-farmlink-lightgreen/20"
            components={{
              DayContent: (props) => {
                const dayTasks = getDayTasks(props.date);
                if (dayTasks.length === 0) return <span className="text-farmlink-darkgreen">{props.date.getDate()}</span>;

                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span className="text-farmlink-darkgreen font-medium">{props.date.getDate()}</span>
                        <Badge
                          variant="secondary"
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-farmlink-green text-white border-0 font-bold"
                        >
                          {dayTasks.length}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white/95 backdrop-blur-sm border border-farmlink-lightgreen/30 shadow-lg">
                      <div className="space-y-2">
                        {dayTasks.map((task) => (
                          <div key={task.id}>
                            <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="font-medium">
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