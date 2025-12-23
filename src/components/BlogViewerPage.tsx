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
  authorName: string;
  authorPhoto?: string;
  coverUrl?: string;
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

  useEffect(() => {
    const blogRef = ref(db, "blogs");
    const unsubscribe = onValue(blogRef, (snap) => {
      try {
        setLoading(true);
        setError(null);
        const data = snap.val();
        if (!data) {
          setBlogs([]);
          setLoading(false);
          return;
        }

        const list: Blog[] = Object.entries(data).map(([id, v]: any) => ({
          id,
          ...v,
        }));

        setBlogs(list.reverse());
        setLoading(false);

        if (!activeBlog && list.length > 0) {
          setActiveBlog(list[0]);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
        setLoading(false);
      }
    }, (error) => {
      console.error("Firebase error:", error);
      setError("Failed to connect to database. Please check your connection.");
      setLoading(false);
    });

    return unsubscribe;
  }, [activeBlog]);

  // 👁️ View increment
  const openBlog = async (blog: Blog) => {
    setActiveBlog(blog);
    await update(ref(db, `blogs/${blog.id}`), {
      views: increment(1),
    });
  };

  // 🔗 Share
  const shareBlog = (id: string) => {
    const url = `${window.location.origin}/blog/${id}`;
    navigator.clipboard.writeText(url);
    alert("Blog link copied 📋");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6fbff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6fbff] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6fbff] px-10 py-8">
      <div className="mx-auto flex max-w-[1400px] gap-10">

        {/* LEFT BLOG VIEWER */}
        <div className="w-[380px] flex-shrink-0">
          <div className="rounded-2xl bg-[#eaf3ff] p-6 shadow-lg">
            <div className="rounded-xl bg-white p-6 text-center shadow-sm">

              <p className="text-[13px] text-gray-500 mb-3">
                {activeBlog?.title || "Album Gallery"}
              </p>

              {/* COVER */}
              <div className="mx-auto h-[220px] w-[160px] rounded-md mb-4 overflow-hidden bg-gray-200">
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

              {/* AUTHOR */}
              {activeBlog && activeBlog.authorName && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                    {activeBlog.authorName[0]}
                  </div>
                  <span className="text-[13px] text-gray-600">
                    {activeBlog.authorName}
                  </span>
                </div>
              )}
            </div>

            {/* NAV (visual only, unchanged) */}
            <div className="mt-6 flex items-center justify-between">
              <button className="flex items-center gap-1 rounded-md bg-[#007bff] px-4 py-1.5 text-[12px] text-white">
                <ChevronLeft size={14} /> Previous
              </button>

              <button className="flex items-center gap-1 rounded-md bg-[#007bff] px-4 py-1.5 text-[12px] text-white">
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT BLOG LIST */}
        <div className="flex-1">
          {blogs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">No blogs available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => openBlog(blog)}
                  className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md border"
                >
                  {/* COVER */}
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

                    {/* AUTHOR */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                        {blog.authorName ? blog.authorName[0] : '?'}
                      </div>
                      <span className="text-sm">{blog.authorName || 'Unknown'}</span>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                      {new Date(blog.createdAt).toDateString()}
                    </p>

                    {/* FOOTER */}
                    <div className="relative border-t pt-3 text-gray-500">

                      <div className="absolute left-0 top-3 flex gap-1">
                        <Heart size={18} /> {blog.likes}
                      </div>

                      <div className="flex justify-center gap-1">
                        <Eye size={18} /> {blog.views}
                      </div>

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          shareBlog(blog.id);
                        }}
                        className="absolute right-0 top-3"
                      >
                        <Share2 size={18} />
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BlogViewerPage;
