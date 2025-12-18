import React from "react";

// Import images from assets
import example1 from "@/assets/examples/example1.jpg";
import example2 from "@/assets/examples/example2.jpg";
import example3 from "@/assets/examples/example3.jpg";
import example4 from "@/assets/examples/example4.jpg";

const examples = [
  { src: example1, alt: "Magazine mockup" },
  { src: example2, alt: "Minimal interior" },
  { src: example3, alt: "Modern auditorium" },
  { src: example4, alt: "Office desk" },
];

const ExamplesSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-[28px] font-arimo font-semibold text-[#0A0A0A]">
            Examples
          </h2>

          <a
            href="#"
            className="text-[14px] font-arimo text-[#0099FF] hover:underline"
          >
            See more →
          </a>
        </div>

        {/* Images grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {examples.map((item, index) => (
            <div
              key={index}
              className="
                group relative
                h-[255px]
                w-[290px]
                overflow-hidden
                rounded-[15px]
                bg-[#F2F4F7]
              "
            >
              <img
                src={item.src}
                alt={item.alt}
                className="
                  h-full w-full object-cover
                  transition-transform duration-300
                  group-hover:scale-[1.04]
                "
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExamplesSection;
