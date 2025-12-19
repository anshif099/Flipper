import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Settings,
  Maximize,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const FlipbookViewer: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fbff] flex items-center justify-center p-8">
      <div className="w-full max-w-[1100px] rounded-xl bg-[#eef6fb] shadow-xl p-6">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-[14px] text-[#4b647a]">
            <span className="px-2 py-0.5 rounded-full bg-[#0099ff] text-white text-[12px]">
              16
            </span>
            <span>of 22</span>

            <span className="ml-4">100%</span>
          </div>

          <div className="flex items-center gap-4">
            <Volume2 size={18} className="text-[#4b647a]" />
            <Settings size={18} className="text-[#4b647a]" />
            <Maximize size={18} className="text-[#4b647a]" />

            <button className="ml-3 rounded-md bg-[#0099ff] px-4 py-1.5 text-white text-[14px]">
              Publish
            </button>
          </div>
        </div>
<div className="pt-10"></div>
        {/* FLIPBOOK CANVAS */}
        <div className="relative bg-white rounded-xl shadow-lg p-6 flex items-center justify-center">

          {/* LEFT PAGE */}
          <div className="relative w-[405px] h-[425px] rounded-lg overflow-hidden bg-[#f0f0f0] shadow">
            <img
              src="https://images.unsplash.com/photo-1523731407965-2430cd12f5e4"
              className="w-full h-full object-cover grayscale"
            />

            <button className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2">
              <ChevronLeft size={18} />
            </button>
          </div>

          {/* RIGHT PAGE */}
          <div className="relative w-[405px] h-[425px] rounded-lg overflow-hidden bg-[#f0f0f0] shadow ml-4">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552"
              className="w-full h-full object-cover grayscale"
            />

            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* MORE PAGES BADGE */}
          <div className="absolute top-4 right-4 rounded-full bg-[#0099ff] px-3 py-1 text-[12px] text-white shadow">
            +12 more pages
          </div>
        </div>

        {/* CONTROLS BAR */}
        <div className="mt-6 grid grid-cols-4 gap-4 text-[13px] text-[#4b647a]">

          {/* FLIP SPEED */}
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="mb-1">Flip Speed</p>
            <div className="flex items-center gap-2">
              <input type="range" className="w-full accent-[#0099ff]" />
              <span>600ms</span>
            </div>
          </div>

          {/* ROLLING */}
          <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
            <p>Rolling</p>
            <div className="w-10 h-5 bg-gray-300 rounded-full relative">
              <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></span>
            </div>
          </div>

          {/* SOUND */}
          <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
            <p>Sound</p>
            <div className="w-10 h-5 bg-[#0099ff] rounded-full relative">
              <span className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></span>
            </div>
          </div>

          {/* ZOOM */}
          <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
            <p>Zoom Level</p>
            <div className="flex items-center gap-2">
              <ZoomOut size={14} />
              <span>100%</span>
              <ZoomIn size={14} />
            </div>
          </div>
        </div>

        {/* DOWNLOAD */}
        <div className="flex justify-center mt-6">
          <button className="rounded-md bg-[#0099ff] px-6 py-2 text-white text-[14px] shadow">
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlipbookViewer;
