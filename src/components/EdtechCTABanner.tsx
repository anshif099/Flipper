import React from "react";

const EdtechCTABanner: React.FC = () => {
  return (
    <section className="w-full bg-[#0099E5]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Text */}
          <div>
            <h2 className="text-[30px] sm:text-[30px] font-arimo font-semibold text-white leading-[36px]">
              Great for EdtechTY Community Library
            </h2>
            <p className="mt-1 text-[16px] font-arimo text-[#DFF2FE] leading-[24px]">
              We love educators and we're here to support your teaching journey
            </p>
          </div>

          {/* Button */}
          <button
            className="
              mt-3 sm:mt-0
              inline-flex items-center justify-center
              rounded-[8px]
              bg-white
              px-6 py-3
              text-[18px]
              font-arimo font-medium
              text-[#0084D1]
              transition
              hover:bg-[#F2F9FF]
              active:scale-[0.98]
            "
          >
            Get Started Free
          </button>

        </div>
      </div>
    </section>
  );
};

export default EdtechCTABanner;
