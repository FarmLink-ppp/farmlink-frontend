import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Share, Bookmark } from "lucide-react";
import CommentForm from "./CommentForm";
import { apiClient } from "@/lib/api";

interface Author {
  name: string;
  avatar?: string;
}

interface Comment {
  id: number;
  author: Author;
  content: string;
  timestamp: string;
}

export interface PostCardProps {
  author: Author;
  date: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  id: number; // Ensure id is required and passed from parent
}

const PostCard: React.FC<PostCardProps> = ({
  author,
  date,
  content,
  image,
  likes: initialLikes,
  comments: initialComments,
  id,
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);

  const handleLike = async () => {
    if (liked) {
      try {
        if (typeof id === "number") {
          await apiClient.unlikePost(id);
          setLikes(likes - 1);
          setLiked(false);
        } else {
          console.warn("No postId provided to PostCard for unlikePost");
        }
      } catch (error) {
        console.error("Unlike post error:", error);
      }
    } else {
      try {
        console.log("in postcard component", id);
        if (typeof id === "number") {
          await apiClient.likePost(id);
        } else {
          console.warn("No postId provided to PostCard for likePost");
        }
        setLikes(likes + 1);
        setLiked(true);
      } catch (error) {
        console.error("Like post error:", error);
      }
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    // In a real app, this would save to a backend
  };

  const handleSubmitComment = (content: string) => {
    const newComment = {
      id: Date.now(),
      author: { name: "John Doe" },
      content,
      timestamp: "Just now",
    };
    setCommentsList([newComment, ...commentsList]);
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4 border-2 border-farmlink-lightgreen/20">
            <AvatarFallback className="bg-gradient-to-br from-farmlink-green/20 to-farmlink-mediumgreen/20 text-farmlink-darkgreen font-semibold">
              {author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-farmlink-darkgreen text-lg">{author.name}</p>
            <p className="text-sm text-farmlink-darkgreen/60">{date}</p>
          </div>
        </div>

        <div>
          <p className="mb-4 text-farmlink-darkgreen leading-relaxed">{content}</p>
          {image && (
            <div className="mb-4 rounded-xl overflow-hidden shadow-md">
              <img src={image} alt="Post" className="w-full h-auto" />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-farmlink-darkgreen/60 mb-4">
          <div>{likes} likes • {commentsList.length + initialComments} comments</div>
        </div>

        <div className="border-t border-farmlink-lightgreen/20 pt-4 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike} 
            className={`transition-all duration-200 ${
              liked 
                ? "text-red-500 bg-red-50 hover:bg-red-100" 
                : "text-farmlink-darkgreen hover:bg-farmlink-green/5"
            }`}
          >
            <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
            {liked ? "Liked" : "Like"}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowComments(!showComments)}
            className="text-farmlink-darkgreen hover:bg-farmlink-green/5 transition-all duration-200"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Comment
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSave}
            className={`transition-all duration-200 ${
              saved 
                ? "text-farmlink-green bg-farmlink-green/10 hover:bg-farmlink-green/20" 
                : "text-farmlink-darkgreen hover:bg-farmlink-green/5"
            }`}
          >
            <Bookmark className={`mr-2 h-4 w-4 ${saved ? "fill-farmlink-green" : ""}`} />
            {saved ? "Saved" : "Save"}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-farmlink-darkgreen hover:bg-farmlink-green/5 transition-all duration-200"
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        {showComments && (
          <div className="mt-6 space-y-4 border-t border-farmlink-lightgreen/20 pt-4">
            <CommentForm onSubmit={handleSubmitComment} />
            
            {commentsList.length > 0 && (
              <div className="space-y-3 mt-4">
                {commentsList.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-farmlink-green/20 to-farmlink-mediumgreen/20 text-farmlink-darkgreen text-xs">
                        {comment.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-farmlink-offwhite/50 p-3 rounded-xl flex-1 border border-farmlink-lightgreen/20">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-semibold text-farmlink-darkgreen">{comment.author.name}</p>
                        <p className="text-xs text-farmlink-darkgreen/50">{comment.timestamp}</p>
                      </div>
                      <p className="text-sm text-farmlink-darkgreen">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {initialComments > 0 && commentsList.length === 0 && (
              <div className="text-center text-sm text-farmlink-darkgreen/60 py-4">
                Be the first to comment on this post!
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;