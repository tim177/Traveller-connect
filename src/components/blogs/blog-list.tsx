"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Clock } from "lucide-react";
import { useBlogStore } from "@/lib/blog-store";
import { formatDistanceToNow } from "date-fns";
import type { Blog } from "@/lib/types";

export default function BlogList() {
  const {
    blogs,
    fetchBlogs,
    selectBlog,
    searchQuery,
    setSearchQuery,
    isLoading,
  } = useBlogStore();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter((blog) => {
    return (
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  // Limit to 2 blogs unless showAll is true
  const displayedBlogs = showAll ? filteredBlogs : filteredBlogs.slice(0, 2);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 dark:border-teal-700 border-t-teal-600 dark:border-t-teal-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-200">
        Travel Blogs
      </h2>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-gray-400" />
        <Input
          placeholder="Search blogs and stories..."
          className="pl-9 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {displayedBlogs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-teal-300 dark:border-teal-700 bg-white/50 dark:bg-gray-800/50 p-8 text-center">
          <p className="text-muted-foreground dark:text-gray-400">
            No blogs found matching your search.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {displayedBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onSelect={() => selectBlog(blog)}
              />
            ))}
          </div>

          {filteredBlogs.length > 2 && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30"
              >
                {showAll ? "Show Less" : `Show All (${filteredBlogs.length})`}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface BlogCardProps {
  blog: Blog;
  onSelect: () => void;
}

function BlogCard({ blog, onSelect }: BlogCardProps) {
  return (
    <Card
      className="overflow-hidden border-teal-200 dark:border-teal-800 bg-white/90 dark:bg-gray-800/90 transition-all hover:shadow-md cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 sm:h-auto sm:w-1/3">
          <Image
            src={blog.coverImage || "/placeholder.svg?height=192&width=384"}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 384px"
          />
        </div>
        <CardContent className="flex-1 p-4">
          <Badge className="mb-2 bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/70 capitalize">
            {blog.category}
          </Badge>
          <h3 className="mb-2 line-clamp-2 text-lg font-bold dark:text-white">
            {blog.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground dark:text-gray-400">
            {blog.excerpt}
          </p>

          <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 overflow-hidden rounded-full bg-teal-100 dark:bg-teal-900">
                <Image
                  src={
                    blog.author.avatar || "/placeholder.svg?height=24&width=24"
                  }
                  width={24}
                  height={24}
                  alt={blog.author.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-xs text-muted-foreground dark:text-gray-400">
                {blog.author.name}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(blog.publishedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
