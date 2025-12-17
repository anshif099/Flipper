import React from "react";
import heroBg from "@/assets/hero-bg.jpg"; // your background image
import uploadArrow from "@/assets/upload.jpg";


const Hero: React.FC = () => {
    return (
        <section
            className="relative w-full h-[calc(100vh-69px)] bg-cover bg-center"
            style={{
                backgroundImage: `url(${heroBg})`,
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/45" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
                <h1 className="w-[610px] h-[60px] font-arimo font-[700px] text-[60px] leading-[60px] text-[#ffff] tracking-[0px] items-center ">
                    FLIPBOOK MAKER
                </h1>

                <p className="mt-4 w-[610px] h-[88px] font-arimo font-[400px] font-[18px] leading-[29.25px] tracking-[0px] items-center">
                    Fast and easy to turn your PDF files into efficient page-flip eBooks — Fully customizable with adding interactive links, tracking readers, analytics, <br></br> search, social media posts, hashtags, layouts, domain, embed and more!
                </p>
<div className="pt-4"></div>
                {/* Upload Box */}
                <div className="w-[585.59px] h-[286.29px]  bg-white rounded-[16px] border border-[1.21px] border-black/10 pt-[33.21px] pr-[33.21px] pb-[1.21px] pl-[33.21px] ">                    <div className="flex flex-col items-center text-center">

                        {/* Icon */}
                        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#00A6F4]">
                            <img
                                src={uploadArrow}
                                alt="Upload"
                                className="w-[28px] h-[28px] object-contain"
                            />
                        </div>



                        {/* Title */}
                        <p className="mb-[10px] text-[16px] font-medium leading-[24px] text-black">
                            Drag & Drop files here
                        </p>

                        {/* Subtitle */}
                        <p className="mb-[22px] text-[13px] leading-[20px] text-black/70">
                            Supported: PDF, JPG, PNG (Max: 10MB per file)
                        </p>

                        {/* Browse */}
                        <button className="flex items-center gap-[6px] text-[14px] font-medium text-black hover:underline">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <path d="M14 2v6h6" />
                            </svg>
                            Browse Files
                        </button>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;
