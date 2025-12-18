import React from "react";
import heroBg from "@/assets/hero-bg.jpg"; // your background image
import uploadArrow from "@/assets/upload.jpg";
import fileIcon from "@/assets/file-icon.png";



const Hero: React.FC = () => {
    return (
        <section
            className="relative w-full h-[795px] bg-cover bg-center"
            style={{
                backgroundImage: `url(${heroBg})`,
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/45" />

            {/* Content */}
            <div className="pt-40 relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
                <h1 className="
                font-bold
  w-full md:w-[610px]
  h-auto md:h-[60px]
  font-arimo font-[700px]
  text-[32px] md:text-[60px]
  leading-[38px] md:leading-[60px]
  text-[#ffff]
  tracking-[0px]
">
  FLIPBOOK MAKER
</h1>

<p className="
  mt-4
   md:w-[610px]
  md:h-[88px]
  font-arimo font-[400px]
  text-[14px] md:text-[17.3px]
  leading-[22px] md:leading-[29.25px]
  tracking-[0px]
">
  Fast and easy to turn your PDF files into efficient page-flip eBooks —
  Fully customizable with adding interactive links, tracking readers,
  analytics, search, social media posts, hashtags, layouts, domain,
  embed and more!
</p>

                <div className="pt-6"></div>
                {/* Upload Box */}
<div className="

  w-full md:w-[585.59px]
  h-auto md:h-[286.29px]
  bg-white rounded-[16px]
  border border-[1.21px] border-black/10
  px-5 md:pt-[33.21px] md:pr-[33.21px] md:pb-[1.21px] md:pl-[33.21px]
  py-8 md:py-0
">
  <div className="flex flex-col items-center text-center">

    {/* Icon */}
    <div className="
      flex items-center justify-center
      h-[60px] w-[60px]
      md:h-[72px] md:w-[72px]
      rounded-full bg-[#00A6F4]
    ">
      <img
        src={uploadArrow}
        alt="Upload"
        className="w-[32px] h-[32px] md:w-[39.98px] md:h-[39.98px] object-contain"
      />
    </div>

    {/* Title */}
    <p className="
      mb-[16px] pt-3
      text-[14px] md:text-[16px]
      leading-[22px] md:leading-[24px]
      font-arimo font-[400px]
      text-[#000000]
    ">
      Drag & Drop files here
    </p>

    {/* Subtitle */}
    <p className="
      mb-[14px]
      text-[13px] md:text-[14px]
      leading-[18px] md:leading-[20px]
      font-arimo font-[400px]
      text-[#000000]
    ">
      Supported: PDF, JPG, PNG (Max: 10MB per file)
    </p>

    {/* Browse */}
    <button className="
      flex items-center gap-[6px]
      text-[14px] md:text-[16px]
      leading-[24px]
      font-arimo text-[#0A0A0A]
      hover:underline
    ">
      <img
        src={fileIcon}
        alt="File icon"
        width={16}
        height={16}
        className="inline-block"
      />
      Browse Files
    </button>

  </div>
</div>


            </div>
        </section>
    );
};

export default Hero;
