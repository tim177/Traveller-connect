export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  caption: string;
  likes: string[]; // Array of user IDs who liked the post
  comments: Comment[];
  createdAt: string;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  timestamp: string;
  relatedPostId?: string; //refrence for the post
}

export interface EscalationComment {
  text: string;
  isFromAgency: boolean;
  createdAt: string;
}

export interface Escalation {
  id: string;
  userId: string;
  userName: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  status: "pending" | "in_progress" | "resolved";
  comments: EscalationComment[];
  createdAt: string;
  updatedAt: string;
}
