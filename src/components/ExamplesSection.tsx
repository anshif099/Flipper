import React, { useState } from "react";

import example1 from "@/assets/examples/example1.jpg";
import example2 from "@/assets/examples/example2.jpg";
import example3 from "@/assets/examples/example3.jpg";
import example4 from "@/assets/examples/example4.jpg";

type Book = {
  src: string;
  title: string;
  description: string;
};

const books: Book[] = [
  {
    src: example1,
    title: "Fashion Magazine",
    description: "A modern fashion flipbook with high-quality layouts.",
  },
  {
    src: example2,
    title: "Interior Design",
    description: "Minimal interior inspirations with smooth page flips.",
  },
  {
    src: example3,
    title: "Architecture Book",
    description: "Showcasing modern architectural masterpieces.",
  },
  {
    src: example4,
    title: "Office Catalogue",
    description: "Professional office setups and workspace designs.",
  },
];

const ExamplesSection: React.FC = () => {
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  // 👉 FULL BOOK VIEW
  if (activeBook) {
    return (
      <section className="w-full bg-white py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => setActiveBook(null)}
            className="mb-6 text-[#0099FF] font-arimo hover:underline"
          >
            ← Back to examples
          </button>

          <div className="flex flex-col items-center gap-6">
            <img
              src={activeBook.src}
              alt={activeBook.title}
              className="w-full max-w-[720px] rounded-[18px] shadow-lg"
            />

            <h2 className="text-[28px] font-arimo font-semibold">
              {activeBook.title}
            </h2>

            <p className="max-w-xl text-center text-[16px] text-[#5A6B7B] font-arimo">
              {activeBook.description}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // 👉 GRID VIEW
  return (
    <section id="examples" className="w-full bg-white py-16 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2  className=" text-[28px] font-arimo font-semibold text-[#0A0A0A]">
            Examples
          </h2>
          <span className="text-[14px] text-[#0099FF] font-arimo">
            See more →
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <div
              key={index}
              className="relative h-[255px] w-[290px] [perspective:1000px]"
            >
              <div className="
                relative h-full w-full
                transition-transform duration-700
                [transform-style:preserve-3d]
                hover:[transform:rotateY(180deg)]
              ">
                {/* FRONT */}
                <div className="
                  absolute inset-0
                  rounded-[15px]
                  overflow-hidden
                  [backface-visibility:hidden]
                ">
                  <img
                    src={book.src}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* BACK */}
                <div className="
                  absolute inset-0
                  rounded-[15px]
                  bg-white
                  border border-[#E6F2FF]
                  p-5
                  flex flex-col justify-between
                  [transform:rotateY(180deg)]
                  [backface-visibility:hidden]
                ">
                  <div>
                    <h3 className="text-[18px] font-arimo font-semibold mb-2">
                      {book.title}
                    </h3>
                    <p className="text-[14px] text-[#5A6B7B] font-arimo">
                      {book.description}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveBook(book)}
                    className="
                      mt-4
                      w-full rounded-md
                      bg-[#0099FF]
                      py-2
                      text-white
                      font-arimo
                      hover:bg-[#0085dd]
                      transition
                    "
                  >
                    View Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExamplesSection;
