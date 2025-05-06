import { create } from "zustand";
import type { Blog } from "./types";
import dedent from "ts-dedent";
interface BlogState {
  blogs: Blog[];
  selectedBlog: Blog | null;
  searchQuery: string;
  isLoading: boolean;
  fetchBlogs: () => Promise<void>;
  selectBlog: (blog: Blog | null) => void;
  setSearchQuery: (query: string) => void;
}

function generateSampleBlogs(): Blog[] {
  return [
    {
      id: "blog-1",
      title: "10 Hidden Gems in Bali You Must Visit",
      excerpt:
        "Discover the secret spots in Bali that most tourists never see...",
      content: dedent(`
        # 10 Hidden Gems in Bali You Must Visit

        Bali is known for its popular beaches and temples, but there's so much more to discover on this beautiful island. Here are ten hidden gems that will make your Bali trip truly special.

        ## 1. Tibumana Waterfall

        Located near Bangli, this stunning waterfall is less crowded than the famous ones. The clear pool at the bottom is perfect for a refreshing swim after the short hike to reach it.

        ## 2. Tukad Cepung Waterfall

        This unique waterfall is hidden inside a cave where sunlight creates magical light beams through the cliff opening above.

        ## 3. Nyang Nyang Beach

        A secluded beach that requires a bit of effort to reach - about 500 steps down a cliff - but rewards you with pristine white sands and almost no crowds.

        ## 4. Sidemen Valley

        Experience the real Bali in this lush valley with rice terraces, without the crowds of Ubud or Tegallalang.

        ## 5. Banyu Wana Amertha Waterfall

        A newly discovered waterfall complex with four beautiful cascades and natural pools.
      `).trim(),
      author: {
        id: "author-1",
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
      },
      coverImage:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      category: "destinations",
      tags: ["bali", "indonesia", "hidden gems", "travel tips"],
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: 5,
      likes: 124,
    },
    {
      id: "blog-2",
      title: "How to Pack for a Month-Long Trip in Just a Carry-On",
      excerpt: "Master the art of minimalist packing with these expert tips...",
      content: dedent(`
        # How to Pack for a Month-Long Trip in Just a Carry-On

        Traveling light doesn't mean sacrificing comfort or style. With these strategic packing tips, you can fit everything you need for a month-long adventure in just a carry-on bag.

        ## Choose the Right Bag

        Start with a high-quality carry-on that maximizes the allowed dimensions for your airline. Look for one with multiple compartments and compression features.

        ## Plan Your Wardrobe Carefully

        * Choose a color scheme so all items can mix and match
        * Select fabrics that resist wrinkles and dry quickly
        * Plan to do laundry every 7–10 days
        * Pack for a week, not a month
      `),
      author: {
        id: "author-2",
        name: "Michael Chen",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Michael",
      },
      coverImage:
        "https://images.unsplash.com/photo-1581553680321-4fffae59fcfa",
      category: "travel tips",
      tags: ["packing", "minimalist travel", "carry-on", "travel hacks"],
      publishedAt: new Date(
        Date.now() - 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
      readTime: 7,
      likes: 2,
    },
    {
      id: "blog-3",
      title: "A Food Lover's Guide to Tokyo",
      excerpt:
        "Explore Tokyo's incredible culinary scene from street food to Michelin stars...",
      content: dedent(`
        # A Food Lover's Guide to Tokyo

        Tokyo is a paradise for food enthusiasts, offering everything from humble street food to the highest concentration of Michelin-starred restaurants in the world. Here's how to navigate this incredible culinary landscape.

        ## Morning: Start at Tsukiji Outer Market

        While the famous inner market has moved to Toyosu, the outer market remains a fantastic place to sample fresh seafood. Don't miss:

        * Tamagoyaki (sweet rolled omelette)
        * Fresh sushi breakfast
        * Matcha treats
      `),
      author: {
        id: "author-3",
        name: "Emma Tanaka",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Emma",
      },
      coverImage:
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
      category: "food",
      tags: ["tokyo", "japan", "food", "culinary travel", "restaurants"],
      publishedAt: new Date(
        Date.now() - 21 * 24 * 60 * 60 * 1000
      ).toISOString(),
      readTime: 8,
      likes: 87,
    },
  ];
}

export const useBlogStore = create<BlogState>((set) => ({
  blogs: [],
  selectedBlog: null,
  searchQuery: "",
  isLoading: false,
  fetchBlogs: async () => {
    set({ isLoading: true });
    try {
      // In a real app, you would fetch from an API
      // For demo, we'll use localStorage or generate sample data
      const storedBlogs = localStorage.getItem("traveller_connect_blogs");
      let blogs: Blog[] = [];

      if (storedBlogs) {
        blogs = JSON.parse(storedBlogs);
      } else {
        // Generate sample blogs if none exist
        blogs = generateSampleBlogs();
        localStorage.setItem("traveller_connect_blogs", JSON.stringify(blogs));
      }

      set({ blogs, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      set({ isLoading: false });
    }
  },
  selectBlog: (blog) => set({ selectedBlog: blog }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
