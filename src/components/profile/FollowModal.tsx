import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, UserCheck, X } from "lucide-react";
import { Follow } from "@/types/follow";

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "followers" | "following";
  data: Follow[];
  isLoading: boolean;
  onUnfollow?: (userId: number) => Promise<void>;
}

const FollowModal: React.FC<FollowModalProps> = ({
  isOpen,
  onClose,
  type,
  data,
  isLoading,
  onUnfollow,
}) => {
  const formatAvatar = (name: string) => {
    if (!name) return "?";
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  const handleUnfollow = async (userId: number) => {
    if (onUnfollow) {
      await onUnfollow(userId);
    }
  };

  const title = type === "followers" ? "Followers" : "Following";
  const emptyMessage =
    type === "followers" ? "No followers yet" : "Not following anyone yet";
  const emptyDescription =
    type === "followers"
      ? "When others follow you, they'll appear here"
      : "Start following others to see them here";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[600px] p-0">
        <DialogHeader className="p-6 pb-4 border-b border-farmlink-lightgreen/20">
          <DialogTitle className="text-xl font-bold text-farmlink-darkgreen flex items-center gap-2">
            <Users className="h-5 w-5" />
            {title} ({data.length})
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[400px]">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-farmlink-green mx-auto"></div>
              <p className="text-farmlink-darkgreen/60 mt-2">Loading...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-farmlink-lightgreen mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-farmlink-darkgreen mb-2">
                {emptyMessage}
              </h3>
              <p className="text-farmlink-darkgreen/60 text-sm">
                {emptyDescription}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {data.map((follow) => {
                const user =
                  type === "followers" ? follow?.follower : follow?.following;

                const displayName =
                  user?.full_name ||
                  `User ${
                    type === "followers"
                      ? follow.follower_id
                      : follow.followed_id
                  }`;
                const displayUsername =
                  user?.username ||
                  `user_${
                    type === "followers"
                      ? follow.follower_id
                      : follow.followed_id
                  }`;
                const profileImage = user?.profile_image;
                const userId =
                  type === "followers"
                    ? follow.follower_id
                    : follow.followed_id;

                return (
                  <div
                    key={follow.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-farmlink-green/5 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border-2 border-farmlink-lightgreen/30">
                        {profileImage && (
                          <AvatarImage
                            src={profileImage}
                            alt={displayName}
                            crossOrigin="anonymous"
                          />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen text-white text-sm font-medium">
                          {formatAvatar(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-farmlink-darkgreen">
                          {displayName}
                        </p>
                        <p className="text-sm text-farmlink-darkgreen/60">
                          @{displayUsername}
                        </p>
                      </div>
                    </div>

                    {type === "following" && onUnfollow && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnfollow(userId)}
                        className="border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Following
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FollowModal;
