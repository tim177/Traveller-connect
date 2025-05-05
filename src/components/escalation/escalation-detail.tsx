"use client";

import {
  addEscalationComment,
  updateEscalationStatus,
} from "@/lib/escalation-service";
import { Escalation, EscalationComment } from "@/lib/types";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { getCategoryLabel, getStatusColor } from "@/lib/escalation-utils";
import { format } from "date-fns";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";

interface EscalationDetailProps {
  escalation: Escalation;
  onBack: () => void;
}

export default function EscalationDetail({
  escalation,
  onBack,
}: EscalationDetailProps) {
  const [comment, setComment] = useState("");
  const [currentEscalation, setCurrentEscalation] =
    useState<Escalation>(escalation);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);

    //Simulate API Call
    setTimeout(() => {
      const updatedEscalation = addEscalationComment(currentEscalation.id, {
        text: comment.trim(),
        isFromAgency: false,
        createdAt: new Date().toISOString(),
      });

      setCurrentEscalation(updatedEscalation);
      setComment("");
      setIsSubmitting(false);
    }, 500);
  };

  const handleStatusChange = (
    newStatus: "pending" | "in_progress" | "resolved"
  ) => {
    const updatedEscalation = updateEscalationStatus(escalation.id, newStatus);
    setCurrentEscalation(updatedEscalation);
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" className="mb-2 text-teal-700" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to list
      </Button>

      <Card className="border-teal-200 bg-white/90">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-teal-800">
              {currentEscalation.title}
            </h2>
            <Badge className={getStatusColor(currentEscalation.status)}>
              {currentEscalation.status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Category: </span>
              <span className="font-medium">
                {getCategoryLabel(currentEscalation.category)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Created: </span>
              <span className="font-medium">
                {format(new Date(currentEscalation.createdAt), "MMM d, yyyy")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Refrence: </span>
              <span className="font-medium">
                {currentEscalation.id.substring(0, 8)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 font-medium">Description</h3>
            <p className="whitespace-pre-wrap text-sm">
              {currentEscalation.description}
            </p>
          </div>

          {currentEscalation.imageUrl && (
            <div>
              <h3 className="mb-2 font-medium">Attachment</h3>
              <div className="relative h-60 w-full overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={currentEscalation.imageUrl || "./placeholder.svg"}
                  alt="Attachment"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 font-medium">Communication</h3>
            {currentEscalation.comments.length === 0 ? (
              <div className="rounded-md bg-gray-50 p-4 text-center text-sm text-muted-foreground">
                No messages yet. Add a comment below to communicate with the
                agency.
              </div>
            ) : (
              <div className="space-y-4">
                {currentEscalation.comments.map((comment, index) => (
                  <CommentBubble key={index} comment={comment} />
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t p-4">
          {currentEscalation.status !== "resolved" && (
            <div className="flex w-full items-center gap-2">
              <Textarea
                placeholder="add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <Button
                className="h-10 w-10 shrink-0 rounded-full bg-teal-600 p-0 hover:bg-teal-700"
                disabled={!comment.trim() || isSubmitting}
                onClick={handleAddComment}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          )}

          {currentEscalation.status !== "resolved" && (
            <div className="flex w-full justify-end">
              <Button
                variant="outline"
                className="text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                onClick={() => handleStatusChange("resolved")}
              >
                Mark as resolved
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

function CommentBubble({ comment }: { comment: EscalationComment }) {
  const isAgency = comment.isFromAgency;

  return (
    <div className={`flex ${isAgency ? "justify-start" : "justify-end"}`}>
      <div
        className={`flex max-w-[80%] gap-2 rounded-lg p-3 ${
          isAgency ? "bg-gray-100" : "bg-teal-100"
        }`}
      >
        {isAgency && (
          <Avatar className="h-8 w-8">
            <AvatarImage src="/agency-logo.png" alt="Travel Agency" />
            <AvatarFallback className="bg-amber-200 text-amber-800">
              TA
            </AvatarFallback>
          </Avatar>
        )}
        <div>
          <p className="text-sm">{comment.text}</p>
          <p className="mt-1 text-xs  text-muted-foreground">
            {format(new Date(comment.createdAt), "MMM d, h:mm a")}
          </p>
        </div>
      </div>
    </div>
  );
}
