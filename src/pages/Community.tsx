
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PostCard from "@/components/community/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, MessageSquare, Filter, Send, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Post {
  id: number;
  author: { name: string; avatar: string };
  date: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

const mockPosts = [
  {
    id: 1,
    author: { name: "Mike Lewis", avatar: "" },
    date: "2 hours ago",
    content: "Has anyone tried the new organic fertilizer from GreenGrow? I'm considering it for my tomato fields but wanted to hear some experiences first.",
    likes: 12,
    comments: 8,
  },
  {
    id: 2,
    author: { name: "Sarah Johnson", avatar: "" },
    date: "6 hours ago",
    content: "Great results with my crop rotation strategy this season! Alternating between corn, soybeans, and cover crops has really improved soil health.",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    likes: 24,
    comments: 6,
  },
  {
    id: 3,
    author: { name: "Emma Davis", avatar: "" },
    date: "Yesterday",
    content: "Looking for advice on dealing with aphid infestation in peppers. Tried neem oil with limited success. Any natural solutions you'd recommend?",
    likes: 7,
    comments: 14,
  },
  {
    id: 4,
    author: { name: "Tom Wilson", avatar: "" },
    date: "2 days ago",
    content: "Excited to share that our irrigation efficiency improved by 30% after implementing the drip system we discussed at last month's community meetup. Thanks for all the advice!",
    image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    likes: 36,
    comments: 9,
  },
];

const trendingTopics = [
  "Organic Farming",
  "Irrigation Systems",
  "Crop Disease",
  "Sustainable Practices",
  "Market Prices",
  "Equipment Sharing",
];

const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    const newPostObj = {
      id: Date.now(),
      author: { name: "John Doe", avatar: "" },
      date: "Just now",
      content: newPost,
      image: imagePreview || undefined,
      likes: 0,
      comments: 0,
    };
    
    setPosts([newPostObj, ...posts]);
    setNewPost("");
    setImagePreview(null);
    
    toast({
      title: "Post created",
      description: "Your post has been published to the community.",
      duration: 3000,
    });
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Users className="mr-2 h-7 w-7 text-farmlink-green" />
              Community Forum
            </h1>
            <p className="text-muted-foreground mt-1">
              Connect with fellow farmers, share insights, and learn from experiences
            </p>
          </div>
          <Button className="hidden md:flex">
            <MessageSquare className="mr-2 h-4 w-4" />
            Start Discussion
          </Button>
        </div>

        <div className="md:hidden">
          <Button className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            Start Discussion
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-4">
                <form onSubmit={handlePostSubmit}>
                  <Textarea
                    placeholder="Share your farming experience or ask a question..."
                    className="resize-none mb-4"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                  
                  {imagePreview && (
                    <div className="mb-4 relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-auto max-h-60 rounded-md object-cover" 
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
                    <div className="flex space-x-2">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" type="button" className="flex items-center gap-1">
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
                      <Button variant="outline" size="sm" type="button">
                        📌 Pin Location
                      </Button>
                    </div>
                    <Button type="submit" disabled={!newPost.trim()}>
                      <Send className="mr-2 h-4 w-4" />
                      Post
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Discussions</h2>
              <div className="flex gap-2">
                <select 
                  className="text-sm border rounded-md px-2 py-1"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Posts</option>
                  <option value="question">Questions</option>
                  <option value="tip">Tips & Tricks</option>
                  <option value="success">Success Stories</option>
                </select>
                <Button variant="ghost" size="sm">
                  <Filter className="mr-1 h-4 w-4" /> Filter
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    author={post.author}
                    date={post.date}
                    content={post.content}
                    image={post.image}
                    likes={post.likes}
                    comments={post.comments}
                  />
                ))
              ) : (
                <div className="text-center p-8 bg-secondary rounded-lg">
                  <p className="text-muted-foreground">No posts match your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
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

            {filteredPosts.length > 0 && (
              <div className="text-center">
                <Button variant="outline">Load More Posts</Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Community</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input 
                    placeholder="Search discussions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setSearchQuery("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTopicClick(topic)}
                    >
                      #{topic.replace(" ", "")}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Farming Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-farmlink-lightgreen/10 p-3 rounded-md">
                  <p className="text-sm italic">
                    "Improve soil health by adding organic matter at least once 
                    per season. It increases water retention and provides vital 
                    nutrients."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Sarah Johnson", "Michael Chen", "Maria Rodriguez", "Ahmed Hassan"].map(
                  (name, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          {name[0]}
                        </div>
                        <span>{name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{32 - index * 5} posts</span>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Community;
