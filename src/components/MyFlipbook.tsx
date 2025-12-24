import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { auth, db } from "@/firebase";

interface Flipbook {
  id: string;
  title: string;
  pageUrls: string[];
  createdAt: number;
}

const MyFlipbooks: React.FC = () => {
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
        }))
        .filter((b: any) => b.userId === user.uid)
        .sort((a, b) => b.createdAt - a.createdAt);

      setFlipbooks(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
        You haven’t created any flipbooks yet.
      </div>
    );
  }

  return (
    <section className="px-10 py-12 bg-[#f6fbff]">
      <h2 className="text-2xl font-semibold mb-6">My Flipbooks</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {flipbooks.map((book) => (
          <div
            key={book.id}
            onClick={() => navigate(`/viewer?id=${book.id}`)}
            className="cursor-pointer rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            {/* COVER */}
            <div className="h-[260px] bg-gray-200 overflow-hidden">
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
              <h3 className="text-[16px] font-semibold mb-1">{book.title}</h3>

              <p className="text-sm text-gray-500">
                {book.pageUrls.length} pages
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(book.createdAt).toDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyFlipbooks;
