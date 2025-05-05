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

export interface Actvity {
  time: string;
  title: string;
  description: string;
  type: "meal" | "sightseeing" | "leisure" | "transport";
  location?: string;
}

export interface ItineraryDay {
  id: string;
  title: string;
  date: string;
  description: string;
  activities: Actvity[];
}

export interface Hotel {
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  amenities: string[];
}

export interface DriverInfo {
  name: string;
  photoUrl: string;
  phoneNumber: string;
  carModel: string;
  carNumber: string;
  languages: string[];
  rating: number;
}

export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  hotel: Hotel;
  inclusions: string[];
  exclusions: string[];
  driverInfo: DriverInfo;
  days: ItineraryDay[];
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatar: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: BlogAuthor;
  coverImage: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  likes: number;
}
