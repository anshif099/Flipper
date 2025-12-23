import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import uploadArrow from "@/assets/upload.jpg";
import fileIcon from "@/assets/file-icon.png";

const Hero: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // ✅ UPDATED ONLY THIS
  const handleGenerate = () => {
    if (files.length === 0) return;

    navigate("/viewer", {
      state: {
        files,
      },
    });
  };

  return (
    <section
      className="relative w-full h-[100vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="pt-20 relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">

        <h1 className="font-bold w-full md:w-[610px] font-arimo text-[32px] md:text-[60px] leading-[38px] md:leading-[60px]">
          FLIPBOOK MAKER
        </h1>

        <p className="mt-4 md:w-[610px] font-arimo text-[14px] md:text-[17.3px] leading-[22px] md:leading-[29.25px]">
          Fast and easy to turn your PDF files into efficient page-flip eBooks —
          Fully customizable with adding interactive links, tracking readers,
          analytics, search, social media posts, hashtags, layouts, domain,
          embed and more!
        </p>

        <div className="pt-6" />

        {/* Upload Box */}
        <div className="w-full md:w-[585.59px] bg-white rounded-[16px] border border-black/10 px-5 md:pt-[33.21px] md:px-[33.21px] py-8">
          <div className="flex flex-col items-center text-center">

            {/* Icon */}
            <div className="flex items-center justify-center h-[60px] w-[60px] md:h-[72px] md:w-[72px] rounded-full bg-[#00A6F4]">
              <img
                src={uploadArrow}
                alt="Upload"
                className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]"
              />
            </div>

            {/* Title */}
            <p className="mb-[16px] pt-3 text-[14px] md:text-[16px] font-arimo text-black">
              Drag & Drop files here
            </p>

            {/* Subtitle */}
            <p className="mb-[14px] text-[13px] md:text-[14px] font-arimo text-black">
              Supported: PDF, JPG, PNG (Max: 10MB per file)
            </p>

            {/* Browse */}
            <button
              onClick={handleBrowseClick}
              className="flex items-center gap-[6px] text-[14px] md:text-[16px] font-arimo text-[#0A0A0A] hover:underline"
            >
              <img src={fileIcon} alt="File icon" width={16} height={16} />
              Browse Files
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Selected files info */}
            {files.length > 0 && (
              <>
                <p className="mt-3 text-[13px] text-gray-600">
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </p>

                <div className="mt-2 max-h-[80px] overflow-y-auto text-[12px] text-gray-500">
                  {files.map((file, i) => (
                    <div key={i}>{file.name}</div>
                  ))}
                </div>

                {/* Generate */}
                <button
                  onClick={handleGenerate}
                  className="mt-4 h-[40px] rounded-md bg-[#0099ff] px-6 text-white font-arimo"
                >
                  Generate Flipbook
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
