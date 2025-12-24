// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ref, onValue } from "firebase/database";
// import { auth, db } from "@/firebase";

// interface Flipbook {
//   id: string;
//   title: string;
//   pageUrls: string[];
//   createdAt: number;
// }

// const MyFlipbooks: React.FC = () => {
//   const navigate = useNavigate();
//   const [flipbooks, setFlipbooks] = useState<Flipbook[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) {
//       setLoading(false);
//       return;
//     }

//     const blogRef = ref(db, "blogs");

//     const unsubscribe = onValue(blogRef, (snap) => {
//       const data = snap.val();
//       if (!data) {
//         setFlipbooks([]);
//         setLoading(false);
//         return;
//       }

//       const list: Flipbook[] = Object.entries(data)
//         .map(([id, v]: any) => ({
//           id,
//           title: v.title || "Untitled Flipbook",
//           pageUrls: v.pageUrls || [],
//           createdAt: v.createdAt,
//           userId: v.userId || v.uid,
//         }))
//         .filter((b: any) => b.userId === user.uid)
//         .sort((a, b) => b.createdAt - a.createdAt);

//       setFlipbooks(list);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-12 text-center text-gray-600">
//         Loading your flipbooks...
//       </div>
//     );
//   }

//   if (flipbooks.length === 0) {
//     return (
//       <div className="py-12 text-center text-gray-500">
//         <h2 className="text-2xl font-semibold mb-6">My Flipbooks</h2>
//         You haven’t created any flipbooks yet.
//       </div>
//     );
//   }

//   return (
//     <section className="px-10 py-12 bg-[#f6fbff]">
//       <h2 className="text-2xl font-semibold mb-6">My Flipbooks</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//         {flipbooks.map((book) => (
//           <div
//             key={book.id}
//             onClick={() => navigate(`/viewer?id=${book.id}`)}
//             className="cursor-pointer rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden"
//           >
//             {/* COVER */}
//             <div className="h-[260px] bg-gray-200 overflow-hidden">
//               {book.pageUrls[0] && (
//                 <img
//                   src={book.pageUrls[0]}
//                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                   alt={book.title}
//                 />
//               )}
//             </div>

//             {/* INFO */}
//             <div className="p-5">
//               <h3 className="text-[16px] font-semibold mb-1">{book.title}</h3>

//               <p className="text-sm text-gray-500">
//                 {book.pageUrls.length} pages
//               </p>

//               <p className="text-xs text-gray-400 mt-2">
//                 {new Date(book.createdAt).toDateString()}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default MyFlipbooks;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue, update, remove } from "firebase/database";
import { auth, db } from "@/firebase";
import { Trash2, Eye, Globe } from "lucide-react";

interface Flipbook {
  id: string;
  title: string;
  pageUrls: string[];
  createdAt: number;
  published: boolean;
}

const MyFlipbook: React.FC = () => {
  const navigate = useNavigate();
  const [flipbooks, setFlipbooks] = useState<Flipbook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const blogRef = ref(db, "blogs");

    const unsubscribe = onValue(blogRef, (snap) => {
      const data = snap.val();
      if (!data) {
        setFlipbooks([]);
        setLoading(false);
        return;
      }

      const list: Flipbook[] = Object.entries(data)
        .map(([id, v]: any) => ({
          id,
          title: v.title || "Untitled Flipbook",
          pageUrls: v.pageUrls || [],
          createdAt: v.createdAt,
          userId: v.userId || v.uid,
          published: v.published || false,
        }))
        .filter((b: any) => b.userId === user.uid)
        .sort((a, b) => b.createdAt - a.createdAt);

      setFlipbooks(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePublish = async (id: string, currentStatus: boolean) => {
    try {
      await update(ref(db, `blogs/${id}`), {
        published: !currentStatus,
      });
      alert(
        !currentStatus
          ? "Flipbook published successfully! 🎉"
          : "Flipbook unpublished."
      );
    } catch (error) {
      console.error("Error updating publish status:", error);
      alert("Failed to update publish status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this flipbook?")) return;

    try {
      await remove(ref(db, `blogs/${id}`));
      alert("Flipbook deleted successfully");
    } catch (error) {
      console.error("Error deleting flipbook:", error);
      alert("Failed to delete flipbook");
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-600">
        Loading your flipbooks...
      </div>
    );
  }

  if (flipbooks.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <h2 className="text-2xl font-semibold mb-6">My Flipbooks</h2>
        <p>You haven't created any flipbooks yet.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-md bg-[#0099ff] px-6 py-2 text-white hover:bg-[#0085dd]"
        >
          Create Your First Flipbook
        </button>
      </div>
    );
  }

  return (
    <section className="px-10 py-12 bg-[#f6fbff] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">My Flipbooks</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {flipbooks.map((book) => (
            <div
              key={book.id}
              className="rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* COVER */}
              <div
                onClick={() => navigate(`/viewer?id=${book.id}`)}
                className="h-[260px] bg-gray-200 overflow-hidden cursor-pointer"
              >
                {book.pageUrls[0] && (
                  <img
                    src={book.pageUrls[0]}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    alt={book.title}
                  />
                )}
              </div>

              {/* INFO */}
              <div className="p-5">
                <h3 className="text-[16px] font-semibold mb-1 truncate">
                  {book.title}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  {book.pageUrls.length} pages
                </p>

                <p className="text-xs text-gray-400 mb-3">
                  {new Date(book.createdAt).toDateString()}
                </p>

                {/* STATUS BADGE */}
                <div className="mb-3">
                  {book.published ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <Globe size={12} />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      <Eye size={12} />
                      Draft
                    </span>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePublish(book.id, book.published)}
                    className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
                      book.published
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-[#0099ff] text-white hover:bg-[#0085dd]"
                    }`}
                  >
                    {book.published ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    onClick={() => handleDelete(book.id)}
                    className="rounded-md bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition"
                    title="Delete Flipbook"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyFlipbook;