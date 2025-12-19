import React from "react";
import heroBg from "@/assets/creatorhero-bg.jpg"; // your background image
import uploadArrow from "@/assets/upload.jpg";
import fileIcon from "@/assets/file-icon.png";



const CreatorHero: React.FC = () => {
    return (
        <section
            className="relative w-full h-[100vh] bg-cover bg-center"
            style={{
                backgroundImage: `url(${heroBg})`,
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <div className="pt-20 relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
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
  FLIPBOOK VIEW
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
  Browse flipbooks submitted by users from the converter. Discover creative 
  designs and inspiring content.
</p>

            </div>
        </section>
    );
};

export default CreatorHero;
