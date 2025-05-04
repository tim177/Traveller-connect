"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import CreatePostModal from "./create-post-modal";
import PostCard from "./post-card";
import CoinBalance from "@/components/coin-system/coin-balance";
import TransactionHistory from "@/components/coin-system/transaction-history";
import CoinShop from "@/components/coin-system/coin-shop";
import type { Post, User } from "@/lib/types";
import { awardCoins } from "@/lib/coin-service";
import {
  addComment,
  createPost,
  getPosts,
  likePost,
} from "@/lib/post-services";

interface TravelFeedProps {
  currentUser: User;
}

export default function TravelFeed({ currentUser }: TravelFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load posts from localStorage
    const loadedPosts = getPosts();
    setPosts(loadedPosts);
    setIsLoading(false);
  }, []);

  const handleCreatePost = (newPost: Post) => {
    const updatedPosts = createPost(newPost);
    setPosts(updatedPosts);
    setIsCreateModalOpen(false);

    // Award coins for posting
    awardCoins(currentUser.id, 100, "Posted a travel update");
    toast.success("Post created successfully!");
  };

  const handleLikePost = (postId: string) => {
    const updatedPosts = likePost(postId, currentUser.id);
    setPosts(updatedPosts);
  };

  const handleAddComment = (postId: string, comment: string) => {
    if (!comment.trim()) return;

    const updatedPosts = addComment(postId, {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      text: comment,
      createdAt: new Date().toISOString(),
    });

    setPosts(updatedPosts);
    toast.success("Comment added!");
  };

  return (
    <>
      <div className="mb-6">
        <CoinBalance
          userId={currentUser.id}
          className="mb-6"
          onViewHistory={() => setIsHistoryOpen(true)}
          onOpenShop={() => setIsShopOpen(true)}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-teal-800">Travel Feed</h2>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-teal-300 bg-white/50 p-8 text-center">
              <p className="text-muted-foreground">
                No posts yet. Be the first to share your travel experience!
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                variant="outline"
                className="mt-4 border-teal-600 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
              >
                Create Post
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUser.id}
                  onLike={handleLikePost}
                  onAddComment={handleAddComment}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="following">
          <div className="rounded-lg border border-dashed border-teal-300 bg-white/50 p-8 text-center">
            <p className="text-muted-foreground">
              Follow other travelers to see their posts here!
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreatePost={handleCreatePost}
        currentUser={currentUser}
      />

      <TransactionHistory
        userId={currentUser.id}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <CoinShop
        userId={currentUser.id}
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
      />
    </>
  );
}
