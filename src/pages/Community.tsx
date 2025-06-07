import React, { useState, useEffect, useContext } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PostCard from "@/components/community/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, MessageSquare, Filter, Send, Image as ImageIcon, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";

interface Post {
  id: number;
  author: { name: string; avatar: string };
  date: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const [visibleCount, setVisibleCount] = useState(5);
  console.log("user in community page", user);
  
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const backendPosts = await apiClient.getFeed();
        // Map backend posts to local Post type
        const mapped = backendPosts.map((p: any) => ({
          id: p.id,
          author: {
            name: p.user?.username || "Unknown",
            avatar: p.user?.profile_image || "",
          },
          date: p.created_at ? new Date(p.created_at).toLocaleString() : "",
          content: p.content,
          image: p.image_urls && p.image_urls.length > 0 ? p.image_urls[0] : undefined,
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
    if (!newPost.trim() && !imagePreview) return;
    try {
      // Call backend API to create post
      const created = await apiClient.createPost({
        content: newPost,
        image_urls: imagePreview ? [imagePreview] : [],
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
      toast({
        title: "Post created",
        description: "Your post has been published to the community.",
        duration: 3000,
      });
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
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      
      toast({
        title: "Image attached",
        description: "Your image has been attached to the post.",
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
      return post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
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
                Connect with fellow farmers, share insights, and learn from experiences
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
                        onClick={() => setImagePreview(null)}
                        type="button"
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" type="button" className="flex items-center gap-2 border-farmlink-lightgreen/30 hover:bg-farmlink-green/5">
                          <ImageIcon className="h-4 w-4" />
                          Photo
                        </Button>
                        <input 
                          id="image-upload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                      </label>
                      <Button variant="outline" size="sm" type="button" className="border-farmlink-lightgreen/30 hover:bg-farmlink-green/5">
                        📌 Pin Location
                      </Button>
                    </div>
                    <Button type="submit" disabled={!newPost.trim()} className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <Send className="mr-2 h-4 w-4" />
                      Post
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-farmlink-darkgreen">Recent Discussions</h2>
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
                <Button variant="ghost" size="sm" className="text-farmlink-darkgreen hover:bg-farmlink-green/5">
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
                    image={post.image}
                    likes={post.likes}
                    comments={post.comments}
                  />
                ))
              ) : (
                <div className="text-center p-8 bg-farmlink-lightgreen/10 rounded-2xl border border-farmlink-lightgreen/20">
                  <p className="text-farmlink-darkgreen/70">No posts match your criteria.</p>
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
                <CardTitle className="text-farmlink-darkgreen">Search Community</CardTitle>
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
              <CardHeader className="pb-4">
                <CardTitle className="text-farmlink-darkgreen">Daily Farming Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-farmlink-lightgreen/10 to-farmlink-green/5 p-4 rounded-xl border border-farmlink-lightgreen/20">
                  <p className="text-sm italic text-farmlink-darkgreen">
                    "Improve soil health by adding organic matter at least once 
                    per season. It increases water retention and provides vital 
                    nutrients."
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