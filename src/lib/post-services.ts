import { Post, Comment } from "./types";

const POST_STORAGE_KEY = "traveller_connect_post";

// Get all posts from localStorage
export function getPosts(): Post[] {
  if (typeof window === "undefined") return [];

  const storedPosts = localStorage.getItem(POST_STORAGE_KEY);
  if (!storedPosts) return [];

  try {
    return JSON.parse(storedPosts);
  } catch (error) {
    console.error("Failed to parse stored posts:", error);
    return [];
  }
}

// Save posts to localStorage
function savePosts(posts: Post[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
}

//create a new post
export function createPost(post: Post): Post[] {
  const posts = getPosts();
  const updatedPost = [...posts, post];
  savePosts(updatedPost);
  return updatedPost;
}

//like or unlike the post
export function likePost(postId: string, userId: string): Post[] {
  const posts = getPosts();

  const updatedPosts = posts.map((post) => {
    if (post.id === postId) {
      const isLiked = post.likes.includes(userId);

      if (isLiked) {
        //unlike the post
        return {
          ...post,
          likes: post.likes.filter((id) => id !== userId),
        };
      } else {
        //like the post
        return {
          ...post,
          likes: [...post.likes, userId],
        };
      }
    }

    return post;
  });

  savePosts(updatedPosts);
  return updatedPosts;
}

//add the comment to the post
export function addComment(postId: string, comment: Comment): Post[] {
  const posts = getPosts();

  const updatedPosts = posts.map((post) => {
    if (post.id === postId) {
      return {
        ...post,
        comments: [...post.comments, comment],
      };
    }
    return post;
  });

  savePosts(updatedPosts);
  return updatedPosts;
}

//generate sample data for testing
export function generateSamplePosts(userId: string, userName: string): Post[] {
  const samplePosts: Post[] = [
    {
      id: "post-1",
      userId,
      userName,
      imageUrl: "https://images.unsplash.com/photo-1527631746610-bca00a040d60",
      caption: "Exploring the beautiful beaches of Bali! 🏝️ #TravelLife",
      likes: [],
      comments: [],
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: "post-2",
      userId,
      userName,
      imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
      caption:
        "The view from my hotel room in Paris. Eiffel Tower looks amazing at sunset! ✨",
      likes: [],
      comments: [],
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  ];

  savePosts(samplePosts);
  return samplePosts;
}
