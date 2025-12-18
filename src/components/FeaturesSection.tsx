import React from "react";
import { BookOpen, Palette, Zap, Lock } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Personal uses",
    description:
      "Easily share memorable moments with friends & family. Create eBooks with built-in analytics to showcase your portfolio, build a personal brand, share photo albums, tell your story, and much more!",
  },
  {
    icon: Palette,
    title: "Free",
    description:
      "Our starter plan is designed for beginners, for an amateur way, or even for those who wish to upload a new edition every day.",
  },
  {
    icon: Zap,
    title: "Fast",
    description:
      "Our service delivery utilizes the state of art of our servers and CDN system with top class content delivery rate with in-depth analytics along the way in near real-time.",
  },
  {
    icon: Lock,
    title: "Technical and publishers",
    description:
      "High level security and sharing for things for strategic or technical. Publish catalogs, manuals, user guides, ebooks, digital editions, and much more.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="w-full bg-[#F6FBFF] py-16 px-4">
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="
              flex flex-col
              w-[284px] h-[326.64px]
              bg-white
              rounded-[14px]
              border-[1.21px] border-[#DFF2FE]
              p-[23.99px]
              gap-[30px]
            "
          >
            {/* Icon */}
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-lg">
              <item.icon className="h-[40px] w-[40px] text-[#00A6F4]" />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[16px] font-arimo font-[400px] text-[#0A0A0A] leading-[24px] tracking-[0px]">
                {item.title}
              </h3>

              <p className="text-[14px] leading-[22px] font-arimo text-[#5A6B7B] font-[400px] tracking-[0px]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
