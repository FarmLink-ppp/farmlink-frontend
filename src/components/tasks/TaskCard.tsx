
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
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-farmlink-lightgreen/20 text-farmlink-darkgreen border-farmlink-lightgreen";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-farmlink-lightgreen/20 text-farmlink-darkgreen border-farmlink-lightgreen";
    }
  };
  
  const handleStatusChange = (value: string) => {
    if (onStatusChange) {
      onStatusChange(value as "pending" | "in-progress" | "completed");
    }
  };

  return (
    <Card className={`border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${status === "completed" ? "opacity-80" : ""}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-xl text-farmlink-darkgreen">{title}</h3>
          <div className="flex items-center space-x-3">
            <Badge className={`${getPriorityColor(priority)} font-semibold px-3 py-1 border`}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
            </Badge>
            <Badge className={`${getStatusColor(status)} font-semibold px-3 py-1 border`}>
              {status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
            </Badge>
          </div>
        </div>
        
        <div className={`${expanded ? "" : "line-clamp-2"} text-farmlink-darkgreen/80 mb-4 leading-relaxed`}>
          {description}
        </div>
        
        {!expanded && description.length > 100 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4 text-farmlink-green hover:text-farmlink-darkgreen hover:bg-farmlink-offwhite/50 px-3 py-2 h-auto text-sm font-medium"
            onClick={() => setExpanded(true)}
          >
            Show more
          </Button>
        )}
        
        {expanded && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4 text-farmlink-green hover:text-farmlink-darkgreen hover:bg-farmlink-offwhite/50 px-3 py-2 h-auto text-sm font-medium"
            onClick={() => setExpanded(false)}
          >
            Show less
          </Button>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center bg-farmlink-offwhite/30 px-3 py-2 rounded-lg">
              <User className="h-4 w-4 mr-2 text-farmlink-green" />
              <span className="text-farmlink-darkgreen font-medium">{assignee.name}</span>
            </div>
            <div className="flex items-center bg-farmlink-offwhite/30 px-3 py-2 rounded-lg">
              <Calendar className="h-4 w-4 mr-2 text-farmlink-green" />
              <span className="text-farmlink-darkgreen font-medium">{dueDate}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-farmlink-darkgreen font-medium">Status:</span>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-10 w-[140px] border-farmlink-lightgreen/30 focus:border-farmlink-green bg-white/80 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm border-farmlink-lightgreen/30">
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