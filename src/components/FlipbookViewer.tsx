import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Settings,
  Maximize,
} from "lucide-react";
import jsPDF from "jspdf";
import { ref, push } from "firebase/database";
import { auth, db } from "@/firebase";

const FlipbookViewer: React.FC = () => {
  const location = useLocation();
  const files: File[] = location.state?.files || [];

  const [pageIndex, setPageIndex] = useState(0);
  const [flipping, setFlipping] = useState<"next" | "prev" | null>(null);

  const totalPages = files.length;

  const flipSoundRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (!flipSoundRef.current) {
      flipSoundRef.current = new Audio("/page-flip.mp3");
    }
    flipSoundRef.current.currentTime = 0;
    flipSoundRef.current.play();
  };

  const getPreview = (file?: File) => {
    if (!file) return null;
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const nextPage = () => {
    if (pageIndex < totalPages - 2 && !flipping) {
      setFlipping("next");
      playSound();
      setTimeout(() => {
        setPageIndex((p) => p + 2);
        setFlipping(null);
      }, 420);
    }
  };

  const prevPage = () => {
    if (pageIndex > 0 && !flipping) {
      setFlipping("prev");
      playSound();
      setTimeout(() => {
        setPageIndex((p) => p - 2);
        setFlipping(null);
      }, 420);
    }
  };

  // ✅ DOWNLOAD FULL BOOK AS PDF (UNCHANGED)
  const handleDownload = async () => {
    if (!files.length) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      const imgData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const img = new Image();
      img.src = imgData;
      await new Promise((res) => (img.onload = res));

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      const ratio = Math.min(pageW / img.width, pageH / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const x = (pageW - w) / 2;
      const y = (pageH - h) / 2;

      if (i !== 0) pdf.addPage();
      pdf.addImage(img, "PNG", x, y, w, h);
    }

    pdf.save("flipbook.pdf");
  };

  // ✅ UPDATED PUBLISH BUTTON (ONLY CHANGE)
  const handlePublish = async () => {
    if (!auth.currentUser) {
      alert("Please login to publish");
      return;
    }

    try {
      await push(ref(db, "blogs"), {
        title: "My Flipbook",
        pages: totalPages,
        createdAt: Date.now(),
        uid: auth.currentUser.uid,
        author: auth.currentUser.displayName || "Anonymous",
        views: 0,
        likes: 0,
      });

      alert("Flipbook published successfully 🚀");
    } catch (error) {
      console.error(error);
      alert("Publish failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fbff] flex items-center justify-center p-8">
      <div className="w-full max-w-[1100px] rounded-xl bg-[#eef6fb] shadow-xl p-6">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-[14px] text-[#4b647a]">
            <span className="px-2 py-0.5 rounded-full bg-[#0099ff] text-white text-[12px]">
              {pageIndex + 1}
            </span>
            <span>of {totalPages}</span>
          </div>

          <div className="flex items-center gap-4">
            <Volume2 size={18} />
            <Settings size={18} />
            <Maximize size={18} />

            {/* PUBLISH */}
            <button
              onClick={handlePublish}
              className="ml-3 rounded-md bg-[#0099ff] px-4 py-1.5 text-white text-[14px]"
            >
              Publish
            </button>
          </div>
        </div>

        <div className="pt-10" />

        {/* FLIPBOOK */}
        <div className="relative bg-white rounded-xl shadow-lg p-6 flex justify-center overflow-hidden">

          {/* LEFT PAGE */}
          <div className="relative w-[405px] h-[425px] bg-[#f0f0f0] rounded-lg shadow overflow-hidden z-10">
            {getPreview(files[pageIndex]) ? (
              <img
                src={getPreview(files[pageIndex])!}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                PDF Page
              </div>
            )}

            <button
              onClick={prevPage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2"
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          {/* PAGE STACK */}
          <div className="absolute right-[30px] top-[30px] w-[405px] h-[425px] bg-[#e6e6e6] rounded-lg shadow -z-0" />
          <div className="absolute right-[18px] top-[18px] w-[405px] h-[425px] bg-[#ededed] rounded-lg shadow -z-0" />

          {/* RIGHT PAGE */}
          <div
            className={`relative w-[405px] h-[425px] ml-4 rounded-lg bg-[#f0f0f0] shadow overflow-hidden z-20
              ${flipping === "next" ? "animate-flip-next" : ""}
              ${flipping === "prev" ? "animate-flip-prev" : ""}
            `}
          >
            {getPreview(files[pageIndex + 1]) ? (
              <img
                src={getPreview(files[pageIndex + 1])!}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                PDF Page
              </div>
            )}

            <button
              onClick={nextPage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* DOWNLOAD */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleDownload}
            className="rounded-md bg-[#0099ff] px-6 py-2 text-white"
          >
            Download
          </button>
        </div>
      </div>

      {/* FLIP ANIMATIONS */}
      <style>{`
        @keyframes flipNext {
          0% {
            transform: translateX(0) rotateZ(0deg);
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          }
          100% {
            transform: translateX(110%) rotateZ(6deg);
            box-shadow: 0 30px 60px rgba(0,0,0,0.35);
            opacity: 0;
          }
        }

        @keyframes flipPrev {
          0% {
            transform: translateX(0) rotateZ(0deg);
          }
          100% {
            transform: translateX(-110%) rotateZ(-6deg);
            opacity: 0;
          }
        }

        .animate-flip-next {
          animation: flipNext 0.42s ease-in-out forwards;
        }

        .animate-flip-prev {
          animation: flipPrev 0.42s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FlipbookViewer;
