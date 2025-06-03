
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-start">
      <Avatar className="mt-1">
        <AvatarFallback className="bg-farmlink-green text-white">JD</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="resize-none mb-2"
          rows={1}
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            size="sm" 
            disabled={!comment.trim()}
            className="flex items-center gap-1"
          >
            <Send className="h-4 w-4" />
            Comment
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
