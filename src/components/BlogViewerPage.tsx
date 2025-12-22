import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Eye,
  Share2,
} from "lucide-react";

const BlogViewerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fbff] px-10 py-8">
      <div className="mx-auto flex max-w-[1400px] gap-10">

        {/* LEFT BLOG VIEWER (UNCHANGED) */}
        <div className="w-[380px] flex-shrink-0">
          <div className="rounded-2xl bg-[#eaf3ff] p-6 shadow-lg">
            <div className="rounded-xl bg-white p-6 text-center shadow-sm">
              <p className="text-[13px] text-gray-500 mb-3">Album Gallery</p>
              <div className="mx-auto h-[220px] w-[160px] bg-gray-200 rounded-md mb-4" />
              <p className="text-[12px] text-gray-500">
                4 photos in this collection
              </p>
            </div>

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

        {/* RIGHT BLOG LIST (UPDATED) */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-8">

            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl bg-white shadow-md border border-black/5"
              >
                {/* IMAGE */}
                <div className="h-[260px] bg-gray-200" />

                {/* CONTENT */}
                <div className="p-5">

                  {/* TITLE */}
                  <h3 className="text-[16px] font-semibold text-gray-900 mb-3">
                    Summer Vibes 2024
                  </h3>

                  {/* DESCRIPTION BOX */}
                  <div className="mb-4 rounded-xl bg-[#f6f7fb] p-4 text-[14px] text-gray-600 leading-relaxed">
                    A collection of summer memories and beautiful moments
                    captured during vacation trips. This album features
                  </div>

                  {/* AUTHOR */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-[12px] font-semibold text-white">
                      SJ
                    </div>
                    <span className="text-[14px] font-medium text-gray-700">
                      Sarah Johnson
                    </span>
                  </div>

                  {/* DATE */}
                  <p className="text-[13px] text-gray-500 mb-4">
                    Jan 15, 2024
                  </p>

                  {/* FOOTER */}
                  {/* FOOTER */}
<div className="relative border-t pt-3 text-gray-500">

  {/* LEFT – Likes */}
  <div className="absolute left-0 top-3 flex items-center gap-1 text-[14px]">
    <Heart size={18} />
    42
  </div>

  {/* CENTER – Views */}
  <div className="flex justify-center text-[14px]">
    <span className="flex items-center gap-1">
      <Eye size={18} />
      1,234
    </span>
  </div>

  {/* RIGHT – Share */}
  <div className="absolute right-0 top-3">
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
