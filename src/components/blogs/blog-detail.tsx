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

export default function BlogDetail() {
  const { selectedBlog, selectBlog } = useBlogStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!selectedBlog) return null;

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
      <Card className="border-teal-200 dark:border-teal-800 bg-white/90 dark:bg-gray-800/90 p-6 overflow-hidden">
        <div className="prose prose-teal dark:prose-invert max-w-none prose-headings:text-teal-900 dark:prose-headings:text-teal-200 prose-a:text-teal-600 dark:prose-a:text-teal-400 prose-img:rounded-md">
          <ReactMarkdown
            components={{
              // Override to ensure proper styling and prevent overflow
              p: ({ children }) => (
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {children}
                </p>
              ),
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mt-6 mb-4 text-teal-900 dark:text-teal-200">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold mt-5 mb-3 text-teal-800 dark:text-teal-300">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold mt-4 mb-2 text-teal-700 dark:text-teal-400">
                  {children}
                </h3>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 mb-4 text-gray-700 dark:text-gray-300">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-teal-300 dark:border-teal-700 pl-4 italic text-gray-600 dark:text-gray-400">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 dark:bg-gray-700 rounded px-1 py-0.5 text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-100 dark:bg-gray-700 rounded p-4 overflow-x-auto text-sm font-mono mb-4">
                  {children}
                </pre>
              ),
              img: ({ src, alt }) => (
                <div className="my-4">
                  <img
                    src={src || "/placeholder.svg"}
                    alt={alt}
                    className="rounded-md max-w-full h-auto"
                  />
                </div>
              ),
            }}
          >
            {selectedBlog.content}
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
