import React from "react";
import {
  BookOpen,
  Smartphone,
  Palette,
  Image,
  Link2,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Fast and reliable",
    desc: "Our fast PDF to flipbook converter can turn even the largest documents to flipbooks in a matter of seconds, not minutes. Turn around time is what we do best.",
  },
  {
    icon: Smartphone,
    title: "Responsive",
    desc: "Our responsive flipbooks can adjust to any screen size. They provide a smooth reading experience on any device – mobile, tablet, or desktop.",
  },
  {
    icon: Palette,
    title: "Customizable",
    desc: "Customize your flipbook with colors, fonts, and branding. Add your logo, change background colors, and create a unique reading experience.",
  },
  {
    icon: Image,
    title: "Videos, audio and pictures",
    desc: "Embed videos, audio files, and images directly into your flipbook pages. Create rich, multimedia experiences for your readers.",
  },
  {
    icon: Link2,
    title: "Links and lead-forms",
    desc: "Add clickable links and lead generation forms to convert readers into customers. Track engagement and gather valuable insights.",
  },
  {
    icon: Lock,
    title: "Privacy and security",
    desc: "Protect your content with password protection and privacy controls. Control who can access your flipbooks and keep your content secure.",
  },
];

const FeaturesGrid: React.FC = () => {
  return (
    <section className="w-full bg-[#F6FBFF] py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="
                bg-white
                rounded-[20px]
                px-8 py-10
                text-center
                shadow-[0_8px_30px_rgba(0,0,0,0.03)]
              "
            >
              {/* Icon badge */}
              <div className="mx-auto mb-5 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#EAF6FF]">
                <item.icon className="h-[24px] w-[24px] text-[#0099FF]" />
              </div>

              {/* Title */}
              <h3 className="mb-3 text-[16px] font-arimo font-semibold text-[#0A0A0A]">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[14px] leading-[22px] font-arimo text-[#5A6B7B]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
