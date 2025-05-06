"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Send, Share2 } from "lucide-react";
import type { Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, comment: string) => void;
}

export default function PostCard({
  post,
  currentUserId,
  onLike,
  onAddComment,
}: PostCardProps) {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const isLikedByCurrentUser = post.likes.includes(currentUserId);

  const handleLike = () => {
    onLike(post.id);
  };

  const handleCommentClick = () => {
    setShowComments(true);
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 100);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onAddComment(post.id, comment);
    setComment("");
  };

  return (
    <Card className="overflow-hidden border-teal-200 gap-0 py-0 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar className="h-10 w-10 border border-teal-200">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${post.userId}`}
            alt={post.userName}
          />
          <AvatarFallback>
            {post.userName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-medium">{post.userName}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>

      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={post.imageUrl || "/placeholder.svg"}
          alt={post.caption}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 500px"
        />
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full flex items-center gap-1.5 ${
                isLikedByCurrentUser
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={handleLike}
            >
              <Heart
                className={`h-5 w-5 ${
                  isLikedByCurrentUser ? "fill-current" : ""
                }`}
              />
              <span className="font-medium">{post.likes.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="rounded-full flex items-center gap-1.5 text-gray-600 hover:text-gray-800"
              onClick={handleCommentClick}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">{post.comments.length}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-gray-600 hover:text-gray-800"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">{post.userName}</span> {post.caption}
          </p>

          {post.comments.length > 0 && (
            <button
              className="text-xs text-teal-600 hover:text-teal-800 font-medium"
              onClick={() => setShowComments(!showComments)}
            >
              {showComments
                ? "Hide comments"
                : `View all ${post.comments.length} comments`}
            </button>
          )}
        </div>
      </CardContent>

      {showComments && post.comments.length > 0 && (
        <>
          <Separator />
          <div className="max-h-40 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2">
                  <Avatar className="h-6 w-6 border border-teal-200">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${comment.userId}`}
                      alt={comment.userName}
                    />
                    <AvatarFallback>
                      {comment.userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{comment.userName}</span>{" "}
                      {comment.text}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      <CardFooter className="p-3 bg-gray-50">
        <form
          onSubmit={handleAddComment}
          className="flex w-full items-center gap-2"
        >
          <Input
            ref={commentInputRef}
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 border-none bg-transparent text-sm focus-visible:ring-1 focus-visible:ring-teal-300"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={!comment.trim()}
            className={`h-8 w-8 rounded-full ${
              !comment.trim() ? "opacity-50" : "text-teal-600 hover:bg-teal-50"
            }`}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Post comment</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
