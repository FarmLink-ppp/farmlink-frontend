
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User } from "lucide-react";

interface Author {
  name: string;
}

interface TaskCardProps {
  title: string;
  description: string;
  assignee: Author;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  onStatusChange?: (status: "pending" | "in-progress" | "completed") => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  assignee,
  dueDate,
  priority,
  status,
  onStatusChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const handleStatusChange = (value: string) => {
    if (onStatusChange) {
      onStatusChange(value as "pending" | "in-progress" | "completed");
    }
  };

  return (
    <Card className={`overflow-hidden ${status === "completed" ? "opacity-75" : ""}`}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(priority)}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
            </Badge>
            <Badge className={getStatusColor(status)}>
              {status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
            </Badge>
          </div>
        </div>
        
        <div className={`${expanded ? "" : "line-clamp-2"} text-sm text-muted-foreground mb-3`}>
          {description}
        </div>
        
        {!expanded && description.length > 100 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-3 text-xs px-2 py-1 h-auto"
            onClick={() => setExpanded(true)}
          >
            Show more
          </Button>
        )}
        
        {expanded && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-3 text-xs px-2 py-1 h-auto"
            onClick={() => setExpanded(false)}
          >
            Show less
          </Button>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{assignee.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{dueDate}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm mr-2">Status:</span>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-8 w-[130px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
