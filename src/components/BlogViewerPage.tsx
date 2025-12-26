import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Eye,
  Share2,
} from "lucide-react";
import {
  ref,
  onValue,
  update,
  increment,
  get,
  child,
} from "firebase/database";
import { auth, db } from "@/firebase";

type Blog = {
  id: string;
  title: string;
  author: string;
  pageUrls: string[];
  createdAt: number;
  likes: number;
  views: number;
  published: boolean;
  likedBy?: Record<string, boolean>;
};

const BlogViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =============================
  // FETCH PUBLISHED BLOGS
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
            likedBy: v.likedBy || {},
          }))
          .filter((b) => b.published)
          .reverse();

        setBlogs(list);
        setActiveBlog((prev) => prev ?? list[0]);
        setSelectedBlogId((prev) => prev ?? list[0]?.id);
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
  // CARD CLICK (PREVIEW / OPEN)
  // =============================
  const handleBlogClick = async (blog: Blog) => {
    if (selectedBlogId !== blog.id) {
      setSelectedBlogId(blog.id);
      setActiveBlog(blog);
      setCurrentPageIndex(0);
      return;
    }

    await update(ref(db, `blogs/${blog.id}`), {
      views: increment(1),
    });

    navigate(`/viewer?id=${blog.id}`);
  };

  // =============================
  // PREVIEW CONTROLS
  // =============================
  const goToPrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((p) => p - 1);
    }
  };

  const goToNext = () => {
    if (
      activeBlog &&
      currentPageIndex < activeBlog.pageUrls.length - 1
    ) {
      setCurrentPageIndex((p) => p + 1);
    }
  };

  // =============================
  // LIKE TOGGLE (PER USER)
  // =============================
  const toggleLike = async (e: React.MouseEvent, blog: Blog) => {
    e.stopPropagation();

    if (!user) {
      alert("Login required to like");
      return;
    }

    const uid = user.uid;
    const blogRef = ref(db, `blogs/${blog.id}`);
    const likedRef = child(blogRef, `likedBy/${uid}`);

    const snap = await get(likedRef);
    const alreadyLiked = snap.exists();

    if (alreadyLiked) {
      // UNLIKE
      await update(blogRef, {
        [`likedBy/${uid}`]: null,
        likes: increment(-1),
      });
    } else {
      // LIKE
      await update(blogRef, {
        [`likedBy/${uid}`]: true,
        likes: increment(1),
      });
    }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0099ff]" />
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

  // =============================
  // MAIN UI
  // =============================
  return (
    <div className="min-h-screen bg-[#f6fbff] px-4 md:px-6 lg:px-10 py-8">
      <div className="mx-auto flex flex-col lg:flex-row max-w-[1400px] gap-8">

        {/* LEFT PREVIEW */}
        <div className="w-full lg:w-[380px]">
          <div className="rounded-2xl bg-[#eaf3ff] p-6 shadow-lg">
            <div className="rounded-xl bg-white p-6 text-center">
              <p className="text-sm text-gray-600 mb-3">
                {activeBlog?.title}
              </p>

              <div className="mx-auto h-[220px] w-[160px] bg-gray-200 rounded-md overflow-hidden mb-4">
                {activeBlog?.pageUrls[currentPageIndex] && (
                  <img
                    src={activeBlog.pageUrls[currentPageIndex]}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <p className="text-xs text-gray-500">
                Page {currentPageIndex + 1} of {activeBlog?.pageUrls.length}
              </p>

              <div className="mt-3 text-sm text-gray-600">
                {activeBlog?.author}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={goToPrevious}
                disabled={currentPageIndex === 0}
                className="bg-[#007bff] text-white px-4 py-1.5 rounded-md text-sm disabled:opacity-50"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              <button
                onClick={goToNext}
                disabled={
                  !activeBlog ||
                  currentPageIndex >= activeBlog.pageUrls.length - 1
                }
                className="bg-[#007bff] text-white px-4 py-1.5 rounded-md text-sm disabled:opacity-50"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT GRID */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {blogs.map((blog) => {
            const liked =
              user && blog.likedBy && blog.likedBy[user.uid];

            return (
              <div
                key={blog.id}
                onClick={() => handleBlogClick(blog)}
                className={`cursor-pointer rounded-2xl bg-white shadow-md border transition ${
                  selectedBlogId === blog.id
                    ? "ring-2 ring-[#0099ff]"
                    : "hover:shadow-lg"
                }`}
              >
                <div className="h-[240px] bg-gray-200 overflow-hidden">
                  {blog.pageUrls[0] && (
                    <img
                      src={blog.pageUrls[0]}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600">{blog.author}</p>

                  <div className="relative border-t mt-3 pt-3 text-gray-500">
                    <div
                      onClick={(e) => toggleLike(e, blog)}
                      className={`absolute left-0 top-3 flex gap-1 ${
                        liked ? "text-red-500" : "hover:text-red-500"
                      }`}
                    >
                      <Heart size={16} fill={liked ? "red" : "none"} />
                      {blog.likes}
                    </div>

                    <div className="flex justify-center gap-1">
                      <Eye size={16} /> {blog.views}
                    </div>

                    <div
                      onClick={(e) => shareBlog(e, blog.id)}
                      className="absolute right-0 top-3 hover:text-blue-500"
                    >
                      <Share2 size={16} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default BlogViewerPage;
