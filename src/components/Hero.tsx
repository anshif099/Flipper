import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase";
import { uploadCompleteFlipbook } from "@/utils/flipbookUpload";
import heroBg from "@/assets/hero-bg.jpg";
import uploadArrow from "@/assets/upload.jpg";
import fileIcon from "@/assets/file-icon.png";

const Hero: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
    status: "",
  });
  const navigate = useNavigate();

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files first");
      return;
    }

    if (!auth.currentUser) {
      alert("Please login to upload flipbooks");
      return;
    }

    try {
      setUploading(true);

      await uploadCompleteFlipbook(
        files,
        title || "My Flipbook",
        (current, total, status) => {
          setUploadProgress({ current, total, status });
        }
      );

      alert(
        "Flipbook uploaded successfully! 🎉\nGo to Creator section to publish it."
      );

      // Navigate to Creator page to see uploaded flipbook
      navigate("/Creator");

      // Reset form
      setFiles([]);
      setTitle("");
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload flipbook");
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0, status: "" });
    }
  };

  return (
    <section
      className="relative w-full h-[100vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-black/60" />

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

            {/* Title Input */}
            <input
              type="text"
              placeholder="Flipbook Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
              disabled={uploading}
            />

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
              disabled={uploading}
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
              disabled={uploading}
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

                {/* Upload Progress */}
                {uploading && (
                  <div className="mt-3 w-full">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${
                            (uploadProgress.current / uploadProgress.total) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-[12px] text-gray-600">
                      {uploadProgress.status}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                {!uploading && (
                  <div className="mt-4 w-full">
                    <button
                      onClick={handleUpload}
                      className="w-full h-[40px] rounded-md bg-[#0099ff] text-white font-arimo hover:bg-[#0085dd]"
                    >
                      Upload Flipbook
                    </button>
                    <p className="mt-2 text-xs text-gray-600">
                      After upload, go to Creator section to publish
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;