import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Eye,
  Share2,
} from "lucide-react";
import { ref, onValue, update, increment } from "firebase/database";
import { db } from "@/firebase";

type Blog = {
  id: string;
  title: string;
  author: string;
  coverUrl: string; // 🔥 REQUIRED
  createdAt: number;
  likes: number;
  views: number;
  pages: number;
};


const BlogViewerPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 FIXED: clean Firebase subscription
  useEffect(() => {
    const blogRef = ref(db, "blogs");

    const unsubscribe = onValue(
      blogRef,
      (snap) => {
        const data = snap.val();
        if (!data) {
          setBlogs([]);
          setActiveBlog(null);
          setLoading(false);
          return;
        }

        const list: Blog[] = Object.entries(data).map(
          ([id, v]: any) => ({
            id,
            ...v,
          })
        );

        const ordered = list.reverse();
        setBlogs(ordered);
        setActiveBlog((prev) => prev ?? ordered[0]);
        setLoading(false);
      },
      () => {
        setError("Failed to load blogs");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 👁️ OPEN BLOG + VIEW COUNT
  const openBlog = async (blog: Blog) => {
    setActiveBlog(blog);
    await update(ref(db, `blogs/${blog.id}`), {
      views: increment(1),
    });
  };

  // ❤️ LIKE
  const likeBlog = async (
    e: React.MouseEvent,
    blog: Blog
  ) => {
    e.stopPropagation();
    await update(ref(db, `blogs/${blog.id}`), {
      likes: increment(1),
    });
  };

  // 🔗 SHARE (NO REDIRECT, NO 404)
  const shareBlog = (
    e: React.MouseEvent,
    blogId: string
  ) => {
    e.stopPropagation();
    const url = `${window.location.origin}/blog?id=${blogId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied 📋");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6fbff] px-10 py-8">
      <div className="mx-auto flex max-w-[1400px] gap-10">

        {/* LEFT VIEWER */}
        <div className="w-[380px] flex-shrink-0">
          <div className="rounded-2xl bg-[#eaf3ff] p-6 shadow-lg">
            <div className="rounded-xl bg-white p-6 text-center shadow-sm">

              <p className="text-[13px] text-gray-500 mb-3">
                {activeBlog?.title ?? "Album Gallery"}
              </p>

              <div className="mx-auto h-[220px] w-[160px] bg-gray-200 rounded-md mb-4 overflow-hidden">
                {activeBlog?.coverUrl && (
                  <img
                    src={activeBlog.coverUrl}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <p className="text-[12px] text-gray-500">
                {activeBlog
                  ? `${activeBlog.pages} pages`
                  : "Preview"}
              </p>

              {activeBlog && (
                <div className="mt-3 text-[13px] text-gray-600">
                  {activeBlog.author}
                </div>
              )}
            </div>

            {/* STATIC NAV */}
            <div className="mt-6 flex justify-between">
              <button className="flex items-center gap-1 rounded-md bg-[#007bff] px-4 py-1.5 text-white text-[12px]">
                <ChevronLeft size={14} /> Previous
              </button>

              <button className="flex items-center gap-1 rounded-md bg-[#007bff] px-4 py-1.5 text-white text-[12px]">
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT LIST */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => openBlog(blog)}
                className="cursor-pointer rounded-2xl bg-white shadow-md border overflow-hidden"
              >
                <div className="h-[260px] bg-gray-200 overflow-hidden">
                  {blog.coverUrl && (
                    <img
                      src={blog.coverUrl}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-[16px] font-semibold mb-3">
                    {blog.title}
                  </h3>

                  <div className="text-sm text-gray-700 mb-2">
                    {blog.author}
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    {new Date(blog.createdAt).toDateString()}
                  </p>

                  <div className="relative border-t pt-3 text-gray-500">

                    <div
                      onClick={(e) => likeBlog(e, blog)}
                      className="absolute left-0 top-3 flex gap-1 cursor-pointer"
                    >
                      <Heart size={18} /> {blog.likes}
                    </div>

                    <div className="flex justify-center gap-1">
                      <Eye size={18} /> {blog.views}
                    </div>

                    <div
                      onClick={(e) => shareBlog(e, blog.id)}
                      className="absolute right-0 top-3 cursor-pointer"
                    >
                      <Share2 size={18} />
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogViewerPage;
