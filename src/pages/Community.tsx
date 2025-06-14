import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PostCard from "@/components/community/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Filter,
  Send,
  Image as ImageIcon,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { DailyTip } from "@/types";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: number;
  author: { name: string; avatar: string };
  date: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

const defaultDailyTip = {
  title: "Today's Farming Tip",
  content:
    "Water your plants early in the morning to reduce evaporation and give them the best start to the day. This helps conserve water and ensures your plants stay hydrated longer.",
  category: "Water Management",
};

const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dailyTip, setDailyTip] = useState<DailyTip | null>(null);
  const { user } = useAuth();
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  console.log("user in community page", user);

  useEffect(() => {
    apiClient
      .getDailyTip()
      .then(setDailyTip)
      .catch((err) => console.error("Failed to fetch daily tip", err));
  }, []);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const backendPosts = await apiClient.getFeed();
        console.log("Fetched posts:", backendPosts);
        // Map backend posts to local Post type
        const mapped = backendPosts.map((p: any) => ({
          id: p.id,
          author: {
            name: p.user?.username || "Unknown",
            avatar: p.user?.profile_image || "",
          },
          date: p.created_at ? new Date(p.created_at).toLocaleString() : "",
          content: p.content,
          image:
            p.image_urls &&
            Array.isArray(p.image_urls) &&
            p.image_urls.length > 0
              ? p.image_urls[0]
              : undefined,
          images: Array.isArray(p.image_urls) ? p.image_urls : [], // Always pass images array
          likes: p.likes ? p.likes.length : 0,
          comments: p.comments ? p.comments.length : 0,
        }));
        setPosts(mapped);
      } catch (error) {
        console.error("Failed to fetch feed:", error);
      }
    };
    fetchFeed();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() && selectedFiles.length === 0) return;
    try {
      const created = await apiClient.createPost({
        content: newPost,
        image_urls: selectedFiles,
        category: "DISCUSSIONS",
      });
      setPosts([
        {
          id: created.id,
          author: { name: user?.username || "Unknown", avatar: "" },
          date: created.date,
          content: created.content,
          image: created.image || undefined,
          likes: created.likes ?? 0,
          comments: created.comments ?? 0,
        },
        ...posts,
      ]);
      setNewPost("");
      setImagePreview(null);
      setSelectedFiles([]);
      toast({
        title: "Post created",
        description: "Your post has been published to the community.",
        duration: 3000,
      });
      // Reload the page to ensure everything is updated
    window.location.reload();

    } catch (error: any) {
      // Log the error to the console for debugging
      console.error("Create post error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create post.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      toast({
        title: filesArray.length > 1 ? "Images attached" : "Image attached",
        description: `You have attached ${filesArray.length} image${
          filesArray.length > 1 ? "s" : ""
        } to the post.`,
        duration: 2000,
      });
    }
  };

  const handleTopicClick = (topic: string) => {
    setSearchQuery(topic);
    toast({
      title: "Topic filter applied",
      description: `Showing posts related to ${topic}`,
      duration: 2000,
    });
  };

  // Filter posts based on selected filter and search query
  const filteredPosts = posts.filter((post) => {
    // First apply category filter
    if (selectedFilter !== "all") {
      // This is simplified - in a real app we would have post categories
      return post.content.toLowerCase().includes(selectedFilter.toLowerCase());
    }

    // Then apply search filter if exists
    if (searchQuery) {
      return (
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return true;
  });

  // Pagination: only show the first `visibleCount` posts
  const paginatedPosts = filteredPosts.slice(0, visibleCount);

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Modern Header Section */}
        <div className="bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 rounded-2xl p-8 border border-farmlink-lightgreen/20">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen rounded-2xl flex items-center justify-center">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-farmlink-darkgreen">
                Community Forum
              </h1>
              <p className="text-farmlink-darkgreen/70 text-lg">
                Connect with fellow farmers, share insights, and learn from
                experiences
              </p>
            </div>
          </div>

          <div className="inline-flex items-center px-4 py-2 rounded-full bg-farmlink-lightgreen/20 text-farmlink-darkgreen text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Join 15,000+ farmers sharing knowledge worldwide
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <form onSubmit={handlePostSubmit}>
                  <Textarea
                    placeholder="Share your farming experience or ask a question..."
                    className="resize-none mb-4 bg-white/70 border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 text-farmlink-darkgreen"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />

                  {imagePreview && (
                    <div className="mb-4 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto max-h-60 rounded-xl object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedFiles([]);
                        }}
                        type="button"
                      >
                        ✕
                      </Button>
                    </div>
                  )}

                  {selectedFiles.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-4">
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="relative w-32 h-32 rounded-xl overflow-hidden border border-farmlink-lightgreen/30 bg-farmlink-offwhite"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 rounded-full"
                            onClick={() => {
                              const newFiles = [...selectedFiles];
                              newFiles.splice(idx, 1);
                              setSelectedFiles(newFiles);
                            }}
                            type="button"
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex items-center gap-2 border-farmlink-lightgreen/30 hover:bg-farmlink-green/5"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Photo
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          multiple
                          onChange={handleImageUpload}
                          tabIndex={-1}
                        />
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        className="border-farmlink-lightgreen/30 hover:bg-farmlink-green/5"
                      >
                        📌 Pin Location
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      disabled={!newPost.trim()}
                      className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Post
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-farmlink-darkgreen">
                Recent Discussions
              </h2>
              <div className="flex gap-2">
                <select
                  className="text-sm border border-farmlink-lightgreen/30 rounded-md px-2 py-1 bg-white/70 text-farmlink-darkgreen"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Posts</option>
                  <option value="question">Questions</option>
                  <option value="tip">Tips & Tricks</option>
                  <option value="success">Success Stories</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-farmlink-darkgreen hover:bg-farmlink-green/5"
                >
                  <Filter className="mr-1 h-4 w-4" /> Filter
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {paginatedPosts.length > 0 ? (
                paginatedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    author={post.author}
                    date={post.date}
                    content={post.content}
                    image={
                      Array.isArray((post as any).image_urls) &&
                      (post as any).image_urls.length > 0
                        ? (post as any).image_urls[0]
                        : post.image
                    }
                    images={
                      Array.isArray((post as any).image_urls)
                        ? (post as any).image_urls
                        : undefined
                    }
                    likes={post.likes}
                    comments={post.comments}
                  />
                ))
              ) : (
                <div className="text-center p-8 bg-farmlink-lightgreen/10 rounded-2xl border border-farmlink-lightgreen/20">
                  <p className="text-farmlink-darkgreen/70">
                    No posts match your criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-green/5"
                    onClick={() => {
                      setSelectedFilter("all");
                      setSearchQuery("");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>

            {filteredPosts.length > visibleCount && (
              <div className="text-center">
                <Button
                  variant="outline"
                  className="border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-green/5"
                  onClick={() => setVisibleCount(visibleCount + 5)}
                >
                  Load More Posts
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-farmlink-darkgreen">
                  Search Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/70 border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 text-farmlink-darkgreen"
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-farmlink-darkgreen/60 hover:text-farmlink-darkgreen"
                      onClick={() => setSearchQuery("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-farmlink-darkgreen flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-farmlink-green" />
                  {dailyTip ? dailyTip.title : defaultDailyTip.title}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-farmlink-lightgreen/20 text-farmlink-darkgreen"
                >
                  {dailyTip ? dailyTip.category : defaultDailyTip.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-xl bg-gradient-to-br from-farmlink-green/5 to-farmlink-mediumgreen/5 border border-farmlink-lightgreen/20">
                  <p className="text-farmlink-darkgreen/80 leading-relaxed text-lg">
                    {dailyTip ? dailyTip.content : defaultDailyTip.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Community;
