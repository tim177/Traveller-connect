"use client";

import { useBlogStore } from "@/lib/blog-store";
import BlogList from "./blog-list";
import BlogDetail from "./blog-detail";

export default function BlogsView() {
  const { selectedBlog } = useBlogStore();

  return selectedBlog ? <BlogDetail /> : <BlogList />;
}
