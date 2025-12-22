import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Eye,
} from "lucide-react";

const BlogViewerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fbff] px-10 py-8">
      <div className="mx-auto flex max-w-[1400px] gap-10">

        {/* LEFT BLOG VIEWER */}
        <div className="w-[380px] flex-shrink-0">
          <div className="rounded-2xl bg-[#eaf3ff] p-6 shadow-lg">

            {/* Viewer Frame */}
            <div className="rounded-xl bg-white p-6 text-center shadow-sm">
              <p className="text-[13px] text-gray-500 mb-3">
                Album Gallery
              </p>

              <div className="mx-auto h-[220px] w-[160px] bg-gray-200 rounded-md mb-4" />

              <p className="text-[12px] text-gray-500">
                4 photos in this collection
              </p>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-between">
              <button className="flex items-center gap-1 rounded-md bg-[#007bff] px-4 py-1.5 text-[12px] text-white">
                <ChevronLeft size={14} />
                Previous
              </button>

              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="h-2 w-2 rounded-full bg-blue-300" />
                <span className="h-2 w-2 rounded-full bg-blue-300" />
              </div>

              <button className="flex items-center gap-1 rounded-md bg-[#007bff] px-4 py-1.5 text-[12px] text-white">
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT BLOG LIST */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-8">

            {[
              {
                title: "Summer Vibes 2024",
                desc: "A collection of summer memories and beautiful moments captured during vacation trips.",
                author: "Sarah Johnson",
                date: "Jan 15, 2024",
                likes: "42",
                views: "1,234",
              },
              {
                title: "Urban Photography",
                desc: "Street photography showcasing the beauty of city life and architecture.",
                author: "Michael Chen",
                date: "Jan 12, 2024",
                likes: "87",
                views: "2,156",
              },
              {
                title: "Nature & Wildlife",
                desc: "Exploring the wonders of nature through stunning landscapes and wildlife photography.",
                author: "Emily Rodriguez",
                date: "Jan 10, 2024",
                likes: "65",
                views: "1,789",
              },
              {
                title: "Wedding Memories",
                desc: "Beautiful moments from a special day filled with love and celebration.",
                author: "David Park",
                date: "Jan 8, 2024",
                likes: "103",
                views: "3,421",
              },
              {
                title: "Travel Diaries",
                desc: "Adventures around the world capturing diverse cultures and destinations.",
                author: "Jessica Wilson",
                date: "Jan 5, 2024",
                likes: "78",
                views: "2,034",
              },
              {
                title: "Food & Cuisine",
                desc: "Delicious culinary creations and dining experiences from around the world.",
                author: "Robert Taylor",
                date: "Jan 3, 2024",
                likes: "54",
                views: "1,567",
              },
            ].map((blog, i) => (
              <div
                key={i}
                className="rounded-xl bg-white shadow-md overflow-hidden"
              >
                {/* Image */}
                <div className="h-[180px] bg-gray-200" />

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
                    {blog.title}
                  </h3>

                  <p className="text-[13px] text-gray-600 leading-snug mb-4">
                    {blog.desc}
                  </p>

                  <div className="flex items-center justify-between text-[12px] text-gray-500">
                    <div>
                      <p className="text-blue-600 font-medium">
                        {blog.author}
                      </p>
                      <p>{blog.date}</p>
                    </div>

                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <Heart size={14} />
                        {blog.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {blog.views}
                      </span>
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
