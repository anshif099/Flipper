// // ============================================
// // FILE: src/components/BlogViewerPage.tsx
// // ============================================

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Heart,
//   Eye,
//   Share2,
// } from "lucide-react";
// import { ref, onValue, update, increment } from "firebase/database";
// import { db } from "@/firebase";

// type Blog = {
//   id: string;
//   title: string;
//   author: string;
//   pageUrls: string[]; // ✅ source of cover image
//   createdAt: number;
//   likes: number;
//   views: number;
// };

// const BlogViewerPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [activeBlog, setActiveBlog] = useState<Blog | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const blogRef = ref(db, "blogs");

//     const unsubscribe = onValue(
//       blogRef,
//       (snap) => {
//         const data = snap.val();

//         if (!data) {
//           setBlogs([]);
//           setActiveBlog(null);
//           setLoading(false);
//           return;
//         }

//         const list: Blog[] = Object.entries(data).map(
//           ([id, v]: any) => ({
//             id,
//             title: v.title,
//             author: v.author || "Anonymous",
//             pageUrls: v.pageUrls || [],
//             createdAt: v.createdAt,
//             likes: v.likes || 0,
//             views: v.views || 0,
//           })
//         );

//         const ordered = list.reverse();
//         setBlogs(ordered);
//         setActiveBlog((prev) => prev ?? ordered[0]);
//         setLoading(false);
//       },
//       () => {
//         setError("Failed to load flipbooks");
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   const openBlog = async (blog: Blog) => {
//     setActiveBlog(blog);

//     await update(ref(db, `blogs/${blog.id}`), {
//       views: increment(1),
//     });

//     navigate(`/viewer?id=${blog.id}`);
//   };

//   const likeBlog = async (
//     e: React.MouseEvent,
//     blog: Blog
//   ) => {
//     e.stopPropagation();
//     await update(ref(db, `blogs/${blog.id}`), {
//       likes: increment(1),
//     });
//   };

//   const shareBlog = (
//     e: React.MouseEvent,
//     blogId: string
//   ) => {
//     e.stopPropagation();
//     const url = `${window.location.origin}/viewer?id=${blogId}`;
//     navigator.clipboard.writeText(url);
//     alert("Link copied 📋");
//   };

//   // =============================
//   // UI STATES
//   // =============================
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0099ff] mx-auto mb-4" />
//           <p className="text-gray-600">Loading flipbooks...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         {error}
//       </div>
//     );
//   }

//   if (blogs.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 mb-4">
//             No flipbooks published yet
//           </p>
//           <a href="/" className="text-[#0099ff] hover:underline">
//             Create your first flipbook
//           </a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f6fbff] px-10 py-8">
//       <div className="mx-auto flex max-w-[1400px] gap-10">

//         {/* LEFT PREVIEW */}
//         <div className="w-[380px] flex-shrink-0">
//           <div className="rounded-2xl bg-[#eaf3ff] p-6 shadow-lg">
//             <div className="rounded-xl bg-white p-6 text-center shadow-sm">

//               <p className="text-[13px] text-gray-500 mb-3">
//                 {activeBlog?.title}
//               </p>

//               <div className="mx-auto h-[220px] w-[160px] bg-gray-200 rounded-md mb-4 overflow-hidden">
//                 {activeBlog?.pageUrls?.[0] && (
//                   <img
//                     src={activeBlog.pageUrls[0]}
//                     className="w-full h-full object-cover"
//                     alt={activeBlog.title}
//                   />
//                 )}
//               </div>

//               <p className="text-[12px] text-gray-500">
//                 {activeBlog?.pageUrls.length} pages
//               </p>

//               <div className="mt-3 text-[13px] text-gray-600">
//                 {activeBlog?.author}
//               </div>
//             </div>

//             <div className="mt-6 flex justify-between">
//               <button className="flex items-center gap-1 rounded-md bg-[#007bff] px-4 py-1.5 text-white text-[12px]">
//                 <ChevronLeft size={14} /> Previous
//               </button>

//               <button className="flex items-center gap-1 rounded-md bg-[#007bff] px-4 py-1.5 text-white text-[12px]">
//                 Next <ChevronRight size={14} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT GRID */}
//         <div className="flex-1">
//           <div className="grid grid-cols-2 gap-8">
//             {blogs.map((blog) => (
//               <div
//                 key={blog.id}
//                 onClick={() => openBlog(blog)}
//                 className="cursor-pointer rounded-2xl bg-white shadow-md border overflow-hidden hover:shadow-lg transition-shadow"
//               >
//                 <div className="h-[260px] bg-gray-200 overflow-hidden">
//                   {blog.pageUrls?.[0] && (
//                     <img
//                       src={blog.pageUrls[0]}
//                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                       alt={blog.title}
//                     />
//                   )}
//                 </div>

//                 <div className="p-5">
//                   <h3 className="text-[16px] font-semibold mb-3">
//                     {blog.title}
//                   </h3>

//                   <div className="text-sm text-gray-700 mb-2">
//                     {blog.author}
//                   </div>

//                   <p className="text-xs text-gray-500 mb-4">
//                     {new Date(blog.createdAt).toDateString()}
//                   </p>

//                   <div className="relative border-t pt-3 text-gray-500">

//                     <div
//                       onClick={(e) => likeBlog(e, blog)}
//                       className="absolute left-0 top-3 flex gap-1 cursor-pointer hover:text-red-500"
//                     >
//                       <Heart size={18} /> {blog.likes}
//                     </div>

//                     <div className="flex justify-center gap-1">
//                       <Eye size={18} /> {blog.views}
//                     </div>

//                     <div
//                       onClick={(e) => shareBlog(e, blog.id)}
//                       className="absolute right-0 top-3 cursor-pointer hover:text-blue-500"
//                     >
//                       <Share2 size={18} />
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default BlogViewerPage;


// ============================================
// FILE: src/components/BlogViewerPage.tsx
// ============================================

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
  pages: number;
};

const BlogViewerPage: React.FC = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // ✅ Track current page
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

        const list: Blog[] = Object.entries(data)
          .map(([id, v]: any) => ({
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
        setError("Failed to load flipbooks");
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

  return (
    <div className="min-h-screen bg-[#f6fbff] px-10 py-8">
      <div className="mx-auto flex max-w-[1400px] gap-10">

        {/* LEFT VIEWER */}
        <div className="w-[380px] flex-shrink-0">
          <div className="rounded-2xl bg-[#eaf3ff] p-6 shadow-lg">
            <div className="rounded-xl bg-white p-6 text-center shadow-sm">

              <p className="text-[13px] text-gray-500 mb-3">
                {activeBlog?.title}
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

              <div className="mt-3 text-[13px] text-gray-600">
                {activeBlog?.author}
              </div>
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

        {/* RIGHT GRID */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                id={`blog-${blog.id}`}
                onClick={() => openBlog(blog)}
                className="cursor-pointer rounded-2xl bg-white shadow-md border overflow-hidden"
              >
                <div className="h-[260px] bg-gray-200 overflow-hidden">
                  {blog.coverUrl && (
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