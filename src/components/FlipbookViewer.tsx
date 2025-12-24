import React, { useRef, useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Settings,
  Maximize,
} from "lucide-react";
import jsPDF from "jspdf";
import { ref, get } from "firebase/database";
import { db } from "@/firebase";
import Header from "./Header";
import Footer from "./Footer";

const FlipbookViewer: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // PREVIEW MODE (before publish)
  const files: File[] = location.state?.files || [];

  // VIEW MODE (after publish)
  const [pageUrls, setPageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [flipping, setFlipping] = useState<"next" | "prev" | null>(null);

  const totalPages = pageUrls.length || files.length;
  const flipSoundRef = useRef<HTMLAudioElement | null>(null);

  // =============================
  // LOAD PUBLISHED FLIPBOOK
  // =============================
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;

    const loadFlipbook = async () => {
      try {
        setLoading(true);
        const snap = await get(ref(db, `blogs/${id}`));
        if (snap.exists()) {
          setPageUrls(snap.val().pageUrls || []);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load flipbook");
      } finally {
        setLoading(false);
      }
    };

    loadFlipbook();
  }, [searchParams]);

  const playSound = () => {
    if (!flipSoundRef.current) {
      flipSoundRef.current = new Audio("/page-flip.mp3");
    }
    flipSoundRef.current.currentTime = 0;
    flipSoundRef.current.play().catch(() => {});
  };

  // =============================
  // IMAGE SOURCE (UNCHANGED UI)
  // =============================
  const getPreview = (index: number) => {
    if (pageUrls.length) return pageUrls[index] || null;

    const file = files[index];
    if (!file) return null;
    return URL.createObjectURL(file);
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

  // =============================
  // DOWNLOAD PDF (ALL IMAGES)
  // =============================
  const handleDownloadPDF = async () => {
    const images = pageUrls.length
      ? pageUrls
      : files.map((f) => URL.createObjectURL(f));

    if (!images.length) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    for (let i = 0; i < images.length; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = images[i];

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

  // =============================
  // STATES
  // =============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading flipbook...
      </div>
    );
  }

  if (!totalPages) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No images found
      </div>
    );
  }

  // =============================
  // RENDER (STYLE UNCHANGED)
  // =============================
  return (
    <>
      <div className="mb-100">
        {" "}
        <Header />
      </div>
      <div className="min-h-screen bg-[#f6fbff] flex items-center justify-center p-8">
        <div className="w-full max-w-[1100px] rounded-xl bg-[#eef6fb] shadow-xl p-6 ">
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

              {/* DOWNLOAD PDF */}
              <button
                onClick={handleDownloadPDF}
                className="ml-2 rounded-md bg-[#0099ff] px-4 py-1.5 text-white text-[14px] hover:bg-[#0085dd]"
              >
                Download PDF
              </button>
            </div>
          </div>

          <div className="pt-10" />

          {/* FLIPBOOK */}
          <div className="relative bg-white rounded-xl shadow-lg p-6 flex justify-center overflow-hidden">
            {/* LEFT PAGE */}
            <div className="relative w-[405px] h-[425px] bg-[#f0f0f0] rounded-lg shadow overflow-hidden z-10">
              {getPreview(pageIndex) ? (
                <img
                  src={getPreview(pageIndex)!}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Page
                </div>
              )}

              {pageIndex > 0 && (
                <button
                  onClick={prevPage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
            </div>

            {/* RIGHT PAGE */}
            <div
              className={`relative w-[405px] h-[425px] ml-4 rounded-lg bg-[#f0f0f0] shadow overflow-hidden z-20
              ${flipping === "next" ? "animate-flip-next" : ""}
              ${flipping === "prev" ? "animate-flip-prev" : ""}
            `}
            >
              {getPreview(pageIndex + 1) ? (
                <img
                  src={getPreview(pageIndex + 1)!}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Page
                </div>
              )}

              {pageIndex < totalPages - 2 && (
                <button
                  onClick={nextPage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
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
      <Footer />
    </>
  );
};

export default FlipbookViewer;
