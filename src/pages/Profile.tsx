import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PostCard from "@/components/community/PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  MessageSquare,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { useFollow } from "@/hooks/useFollow";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import FollowModal from "@/components/profile/FollowModal";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [sharedPosts, setSharedPosts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "followers" | "following" | "requests"
  >("followers");
  const {
    profile,
    loading: isProfileLoading,
    error: isProfileError,
  } = useUserProfile();
  const {
    followRequests,
    followers,
    following,
    isLoading: isFollowLoading,
    error: isFollowError,
    unfollowUser,
    acceptFollowRequest,
    rejectFollowRequest,
    refetchAllFollowData,
  } = useFollow();

  const formatAvatar = (name: string) => {
    if (!name) return "?";
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  const handleFollowersClick = () => {
    setModalType("followers");
    setModalOpen(true);
  };

  const handleFollowingClick = () => {
    setModalType("following");
    setModalOpen(true);
  };

  const handleFollowRequestsClick = () => {
    setModalType("requests");
    setModalOpen(true);
  };

  const handleUnfollow = async (userId: number) => {
    try {
      await unfollowUser(userId);
      await refetchAllFollowData();
      toast({
        title: "Success",
        description: "User unfollowed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unfollow user",
        variant: "destructive",
      });
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await acceptFollowRequest(requestId);
      await refetchAllFollowData();
      toast({
        title: "Success",
        description: "Follow request accepted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept follow request",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await rejectFollowRequest(requestId);
      await refetchAllFollowData();
      toast({
        title: "Success",
        description: "Follow request rejected",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject follow request",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const backendPosts = await apiClient.getUserPosts();
        const mapped = backendPosts.map((p: any) => ({
          id: p.id,
          author: {
            name: p.user?.username || "Unknown",
            avatar: p.user?.profile_image || "",
          },
          date: p.created_at ? new Date(p.created_at).toLocaleString() : "",
          content: p.content,
          image:
            p.image_urls && p.image_urls.length > 0
              ? p.image_urls[0]
              : undefined,
          likes: p.likes ? p.likes.length : 0,
          comments: p.comments ? p.comments.length : 0,
        }));
        setUserPosts(mapped);
      } catch (error) {
        console.error("Failed to fetch user posts:", error);
      }
    };
    fetchUserPosts();
  }, []);

  useEffect(() => {
    const fetchSharedPosts = async () => {
      try {
        const backendPosts = await apiClient.getUserSharedPosts();
        console.log("Fetched shared posts:", backendPosts);

        const mapped = backendPosts.map((p: any) => ({
          id: p.id,
          author: {
            name: p.user?.username || "Unknown",
            avatar: p.user?.profile_image || "",
          },
          date: p.created_at ? new Date(p.created_at).toLocaleString() : "",
          content: p.content,
          image:
            p.image_urls && p.image_urls.length > 0
              ? p.image_urls[0]
              : undefined,
          likes: p.likes ? p.likes.length : 0,
          comments: p.comments ? p.comments.length : 0,
        }));
        setSharedPosts(mapped);
      } catch (error) {
        console.error("Failed to fetch shared posts:", error);
      }
    };
    fetchSharedPosts();
  }, []);

  const error = isProfileError || isFollowError;

  useEffect(() => {
    if (error === "Farm not found") return;
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Profile Header */}
        <Card className="border-0 bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                  <img
                    src={profile?.profile_image || ""}
                    crossOrigin="anonymous"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen text-white text-4xl font-bold">
                    {isProfileLoading
                      ? "Loading..."
                      : formatAvatar(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-farmlink-green rounded-full flex items-center justify-center border-4 border-white">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold text-farmlink-darkgreen mb-2">
                  {isProfileLoading ? "Loading..." : profile?.full_name}
                </h1>
                <p className="text-farmlink-darkgreen/70 text-lg mb-4">
                  {isProfileLoading ? "Loading..." : profile?.bio}
                </p>

                <div className="flex items-center space-x-6 text-farmlink-darkgreen/60 mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {isProfileLoading ? "Loading..." : profile?.location}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {isProfileLoading
                        ? "Loading..."
                        : profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-2">
                    <p className="text-2xl font-bold text-farmlink-darkgreen">
                      {userPosts.length || "0"}
                    </p>
                    <p className="text-sm text-farmlink-darkgreen/60">Posts</p>
                  </div>
                  <div
                    className="text-center cursor-pointer hover:bg-farmlink-green/5 rounded-lg p-2 transition-colors"
                    onClick={handleFollowersClick}
                  >
                    <p className="text-2xl font-bold text-farmlink-darkgreen">
                      {isFollowLoading ? "Loading..." : followers.length || "0"}
                    </p>
                    <p className="text-sm text-farmlink-darkgreen/60">
                      Followers
                    </p>
                  </div>
                  <div
                    className="text-center cursor-pointer hover:bg-farmlink-green/5 rounded-lg p-2 transition-colors"
                    onClick={handleFollowingClick}
                  >
                    <p className="text-2xl font-bold text-farmlink-darkgreen">
                      {isFollowLoading ? "Loading..." : following.length || "0"}
                    </p>
                    <p className="text-sm text-farmlink-darkgreen/60">
                      Following
                    </p>
                  </div>
                  <div
                    className="text-center cursor-pointer hover:bg-farmlink-green/5 rounded-lg p-2 transition-colors"
                    onClick={handleFollowRequestsClick}
                  >
                    <p className="text-2xl font-bold text-farmlink-darkgreen">
                      {isFollowLoading
                        ? "Loading..."
                        : followRequests?.length || "0"}
                    </p>
                    <p className="text-sm text-farmlink-darkgreen/60">
                      Requests
                    </p>
                    {isFollowLoading
                      ? "Loading..."
                      : followRequests.length > 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              {followRequests?.length > 9
                                ? "9+"
                                : followRequests?.length}
                            </span>
                          </div>
                        )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <Link to="/settings">
                  <Button className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white px-6">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-white/80 backdrop-blur-sm border-2 border-farmlink-lightgreen/30 p-1 rounded-xl shadow-lg">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-farmlink-green data-[state=active]:to-farmlink-mediumgreen data-[state=active]:text-white text-farmlink-darkgreen font-medium px-6 py-2 rounded-lg transition-all duration-300 flex items-center"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              My Posts
            </TabsTrigger>
            <TabsTrigger
              value="shared"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-farmlink-green data-[state=active]:to-farmlink-mediumgreen data-[state=active]:text-white text-farmlink-darkgreen font-medium px-6 py-2 rounded-lg transition-all duration-300 flex items-center"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Shared Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-farmlink-darkgreen">
                My Posts ({userPosts.length})
              </h2>
            </div>

            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={post.author}
                  date={post.date}
                  content={post.content}
                  image={post.image}
                  likes={post.likes}
                  comments={post.comments}
                />
              ))}

              {userPosts.length === 0 && (
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-16 w-16 text-farmlink-lightgreen mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-farmlink-darkgreen mb-2">
                      No posts yet
                    </h3>
                    <p className="text-farmlink-darkgreen/60 mb-6">
                      Share your farming experiences with the community!
                    </p>
                    <Link to="/community">
                      <Button className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white">
                        Create Your First Post
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="shared" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-farmlink-darkgreen">
                Shared Posts ({sharedPosts.length})
              </h2>
            </div>
            <div className="space-y-6">
              {sharedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={post.author}
                  date={post.date}
                  content={post.content}
                  image={post.image}
                  likes={post.likes}
                  comments={post.comments}
                />
              ))}
              {sharedPosts.length === 0 && (
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Bookmark className="h-16 w-16 text-farmlink-lightgreen mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-farmlink-darkgreen mb-2">
                      No shared posts
                    </h3>
                    <p className="text-farmlink-darkgreen/60 mb-6">
                      Share interesting posts to see them here!
                    </p>
                    <Button
                      variant="outline"
                      className="border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-green/5"
                    >
                      Browse Community
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <FollowModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          type={modalType}
          data={
            modalType === "followers"
              ? followers
              : modalType === "following"
              ? following
              : followRequests
          }
          isLoading={isFollowLoading}
          onUnfollow={modalType === "following" ? handleUnfollow : undefined}
          onAcceptRequest={
            modalType === "requests" ? handleAcceptRequest : undefined
          }
          onRejectRequest={
            modalType === "requests" ? handleRejectRequest : undefined
          }
        />
      </div>
    </MainLayout>
  );
};

export default Profile;
