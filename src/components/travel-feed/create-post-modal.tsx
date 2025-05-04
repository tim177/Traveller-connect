"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, X } from "lucide-react";
import type { Post, User } from "@/lib/types";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: Post) => void;
  currentUser: User;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onCreatePost,
  currentUser,
}: CreatePostModalProps) {
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!selectedImage || !caption.trim()) return;

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        imageUrl: selectedImage,
        caption: caption.trim(),
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };

      onCreatePost(newPost);
      resetForm();
      setIsLoading(false);
    }, 1000);
  };

  const resetForm = () => {
    setCaption("");
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your travel experience with others
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {selectedImage ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Selected"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          ) : (
            <div
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-teal-300 bg-gray-50 hover:bg-gray-100"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="mb-2 h-10 w-10 text-teal-500" />
              <p className="text-sm text-muted-foreground">
                Click to upload an image
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          )}

          <Textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-teal-600 hover:bg-teal-700"
            disabled={!selectedImage || !caption.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
