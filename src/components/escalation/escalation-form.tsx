"use client";

import { createEscalation } from "@/lib/escalation-service";
import { Escalation, User } from "@/lib/types";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";

interface EscalationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onEscalationCreated: (escalation: Escalation) => void;
  currentUser: User;
}

export default function EscalationForm({
  isOpen,
  onClose,
  onEscalationCreated,
  currentUser,
}: EscalationFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");

    if (!title.trim) {
      setError("Please enter a title");
      return;
    }

    if (!description.trim) {
      setError("Please enter a description");
      return;
    }

    if (!category) {
      setError("Please select a category");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const newEscalation = createEscalation({
          userId: currentUser.id,
          userName: currentUser.name,
          title: title.trim(),
          description: description.trim(),
          category,
          imageUrl: selectedImage || undefined,
        });

        onEscalationCreated(newEscalation);
        resetForm();
      } catch (error) {
        console.log("Failed to create escalation. Please try again.", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setSelectedImage(null);
    setError("");
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
          <DialogTitle>Create New Escalation</DialogTitle>
          <DialogDescription>
            Submit an issue to escalate to the travel agency
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="rounded-md bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief Summary of the title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="booking">Booking Issue</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="itinerary">Itinerary Change</SelectItem>
                <SelectItem value="refund">Refund Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description"> Description</Label>
            <Textarea
              id="description"
              placeholder="Please provide details about your issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-2">
            <Label>Attachment (Optional)</Label>
            {selectedImage ? (
              <div className="relative overflow-hidden h-40 w-full rounded-md bg-gray-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-4 h-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
                <Image
                  src={selectedImage || "./placeholder.svg"}
                  alt="Attachment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            ) : (
              <div
                className="flex flex-col h-40 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-teal-500 bg-gray-50 hover:bg-gray-100 "
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
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-teal-600 hover:bg-teal-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
