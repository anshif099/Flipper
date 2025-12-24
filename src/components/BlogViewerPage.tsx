import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  pageUrls: string[];
  createdAt: number;
  likes: number;
  views: number;
  published: boolean;
};

const BlogViewerPage: React.FC = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // ✅ Track current page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =============================
  // FETCH ONLY PUBLISHED BLOGS
  // =============================
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

        const list: Blog[] = Object.entries(data)
          .map(([id, v]: any) => ({
            id,
            title: v.title,
            author: v.author || "Anonymous",
            pageUrls: v.pageUrls || [],
            createdAt: v.createdAt,
            likes: v.likes || 0,
            views: v.views || 0,
            published: v.published || false,
          }))
          .filter((blog) => blog.published === true) // ✅ Only show published
          .reverse();

        setBlogs(list);
        setActiveBlog((prev) => prev ?? list[0]);
        setLoading(false);
      },
      () => {
        setError("Failed to load flipbooks");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // =============================
  // ACTIVE INDEX
  // =============================
  const activeIndex = blogs.findIndex((b) => b.id === activeBlog?.id);

  // =============================
  // HANDLERS
  // =============================
  const openBlog = async (blog: Blog) => {
    setActiveBlog(blog);
    setCurrentPageIndex(0); // ✅ Reset to first page when opening new flipbook

    await update(ref(db, `blogs/${blog.id}`), {
      views: increment(1),
    });

    navigate(`/viewer?id=${blog.id}`);
  };

  const goToPrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const goToNext = () => {
    if (activeBlog && currentPageIndex < activeBlog.pageUrls.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const likeBlog = async (e: React.MouseEvent, blog: Blog) => {
    e.stopPropagation();
    await update(ref(db, `blogs/${blog.id}`), {
      likes: increment(1),
    });
  };

  const shareBlog = (e: React.MouseEvent, blogId: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}/viewer?id=${blogId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied 📋");
  };

  // =============================
  // UI STATES
  // =============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0099ff] mx-auto mb-4" />
          <p className="text-gray-600">Loading flipbooks...</p>
        </div>
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

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No published flipbooks yet</p>
          <a href="/" className="text-[#0099ff] hover:underline">
            Create your first flipbook
          </a>
        </div>
      </div>
    );
  }

  // =============================
  // MAIN UI
  // =============================
  return (
    <div className="min-h-screen bg-[#f6fbff] px-4 md:px-6 lg:px-10 py-8">
      <div className="mx-auto flex flex-col lg:flex-row max-w-[1400px] gap-6 lg:gap-10">
        {/* LEFT PREVIEW */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <div className="rounded-2xl bg-[#eaf3ff] p-4 md:p-6 shadow-lg">
            <div className="rounded-xl bg-white p-4 md:p-6 text-center shadow-sm">
              <p className="text-[13px] text-gray-500 mb-3">
                {activeBlog?.title}
              </p>

              <div className="mx-auto h-[220px] w-[160px] bg-gray-200 rounded-md mb-4 overflow-hidden">
                {activeBlog?.pageUrls?.[currentPageIndex] && (
                  <img
                    src={activeBlog.pageUrls[currentPageIndex]}
                    className="w-full h-full object-cover"
                    alt={`${activeBlog.title} - Page ${currentPageIndex + 1}`}
                  />
                )}
              </div>

              <p className="text-[12px] text-gray-500">
                Page {currentPageIndex + 1} of {activeBlog?.pageUrls.length}
              </p>

              <div className="mt-3 text-[13px] text-gray-600">
                {activeBlog?.author}
              </div>
            </div>

            {/* PREV / NEXT */}
            <div className="mt-6 flex justify-between gap-2">
              <button
                onClick={goToPrevious}
                disabled={currentPageIndex <= 0 || !activeBlog}
                className="flex items-center gap-1 rounded-md bg-[#007bff] px-3 md:px-4 py-1.5 text-white text-[12px]
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              <button
                onClick={goToNext}
                disabled={!activeBlog || currentPageIndex >= (activeBlog?.pageUrls.length || 0) - 1}
                className="flex items-center gap-1 rounded-md bg-[#007bff] px-3 md:px-4 py-1.5 text-white text-[12px]
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT GRID */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                id={`blog-${blog.id}`}
                onClick={() => openBlog(blog)}
                className={`cursor-pointer rounded-2xl bg-white shadow-md border overflow-hidden transition-all ${
                  activeBlog?.id === blog.id
                    ? 'ring-2 ring-[#0099ff] shadow-xl'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="h-[200px] sm:h-[260px] bg-gray-200 overflow-hidden">
                  {blog.pageUrls?.[0] && (
                    <img
                      src={blog.pageUrls[0]}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      alt={blog.title}
                    />
                  )}
                </div>

                <div className="p-4 md:p-5">
                  <h3 className="text-[15px] md:text-[16px] font-semibold mb-2 md:mb-3 line-clamp-1">
                    {blog.title}
                  </h3>

                  <div className="text-sm text-gray-700 mb-2">
                    {blog.author}
                  </div>

                  <p className="text-xs text-gray-500 mb-3 md:mb-4">
                    {new Date(blog.createdAt).toDateString()}
                  </p>

                  <div className="relative border-t pt-3 text-gray-500">
                    <div
                      onClick={(e) => likeBlog(e, blog)}
                      className="absolute left-0 top-3 flex gap-1 cursor-pointer hover:text-red-500"
                    >
                      <Heart size={16} className="md:w-[18px] md:h-[18px]" /> 
                      <span className="text-xs md:text-sm">{blog.likes}</span>
                    </div>

                    <div className="flex justify-center gap-1">
                      <Eye size={16} className="md:w-[18px] md:h-[18px]" /> 
                      <span className="text-xs md:text-sm">{blog.views}</span>
                    </div>

                    <div
                      onClick={(e) => shareBlog(e, blog.id)}
                      className="absolute right-0 top-3 cursor-pointer hover:text-blue-500"
                    >
                      <Share2 size={16} className="md:w-[18px] md:h-[18px]" />
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