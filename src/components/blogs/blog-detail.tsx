"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, BookmarkPlus, Share2, Clock } from "lucide-react";
import { useBlogStore } from "@/lib/blog-store";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import remarkGfm from "remark-gfm";
import dedent from "ts-dedent";

export default function BlogDetail() {
  const { selectedBlog, selectBlog } = useBlogStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!selectedBlog) return null;
  const trimmedSelected = dedent(selectedBlog.content);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from likes" : "Added to likes");
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from bookmarks" : "Saved to bookmarks");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedBlog.title,
        text: selectedBlog.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="mb-2 text-teal-700 dark:text-teal-300"
        onClick={() => selectBlog(null)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blogs
      </Button>

      {/* Blog Header */}
      <div className="relative h-64 w-full overflow-hidden rounded-lg sm:h-80">
        <Image
          src={
            selectedBlog.coverImage || "/placeholder.svg?height=384&width=768"
          }
          alt={selectedBlog.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <Badge className="mb-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 capitalize">
            {selectedBlog.category}
          </Badge>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {selectedBlog.title}
          </h1>
        </div>
      </div>

      {/* Blog Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-teal-100 dark:bg-teal-900">
            <Image
              src={
                selectedBlog.author.avatar ||
                "/placeholder.svg?height=40&width=40"
              }
              width={40}
              height={40}
              alt={selectedBlog.author.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium dark:text-white">
              {selectedBlog.author.name}
            </p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {format(new Date(selectedBlog.publishedAt), "MMMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>{selectedBlog.readTime} min read</span>
        </div>
      </div>

      {/* Blog Content */}
      <Card className="border-teal-200 dark:border-teal-800 bg-white/90 dark:bg-gray-800/90 p-4 sm:p-6 overflow-hidden">
        <div className="blog-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {trimmedSelected}
          </ReactMarkdown>
        </div>
      </Card>

      {/* Blog Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-teal-200 dark:border-teal-800 bg-white/90 dark:bg-gray-800/90 p-4">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex gap-1 ${
              isLiked
                ? "text-red-500 dark:text-red-400"
                : "text-muted-foreground dark:text-gray-400"
            }`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{isLiked ? selectedBlog.likes + 1 : selectedBlog.likes}</span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex gap-1 ${
              isSaved
                ? "text-amber-500 dark:text-amber-400"
                : "text-muted-foreground dark:text-gray-400"
            }`}
            onClick={handleSave}
          >
            <BookmarkPlus
              className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
            />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex gap-1 text-muted-foreground dark:text-gray-400"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {selectedBlog.tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
