
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Share } from "lucide-react";
import CommentForm from "./CommentForm";

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
}

const PostCard: React.FC<PostCardProps> = ({
  author,
  date,
  content,
  image,
  likes: initialLikes,
  comments: initialComments,
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
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
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{author.name}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>

        <div>
          <p className="mb-4">{content}</p>
          {image && (
            <div className="mb-4 rounded-md overflow-hidden">
              <img src={image} alt="Post" className="w-full h-auto" />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div>{likes} likes • {commentsList.length + initialComments} comments</div>
        </div>

        <div className="border-t border-b my-3 py-2 flex justify-between">
          <Button variant="ghost" size="sm" onClick={handleLike} className={liked ? "text-red-500" : ""}>
            <Heart className={`mr-1 h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
            Like
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
            <MessageSquare className="mr-1 h-4 w-4" />
            Comment
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>

        {showComments && (
          <div className="mt-4 space-y-4">
            <CommentForm onSubmit={handleSubmitComment} />
            
            {commentsList.length > 0 && (
              <div className="space-y-3 mt-4">
                {commentsList.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary p-3 rounded-lg flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{comment.author.name}</p>
                        <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {initialComments > 0 && commentsList.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-2">
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
