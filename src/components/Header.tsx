import React, { useState } from "react";
import logo from "@/assets/logo.png";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full h-[69px] border-[1.21px] border-[#B8E6FE]/50 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center px-6">

        {/* LEFT */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-[19.99px] h-[17.99px]" />
          <span className="font-arimo font-bold text-[20px] leading-[28px] text-[#0A0A0A]">
            Flipbook
          </span>
        </div>

        {/* CENTER NAV (Desktop only – unchanged) */}
        <nav className="absolute left-1/2 top-[2.3em] hidden -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-8 text-[16px] text-[#364153] font-arimo">
          <a href="#">Creator</a>
          <a href="#">Samples</a>
          <a href="#">Prints</a>
          <a href="#">Guide</a>
          <a href="#">Install</a>
        </nav>

        {/* RIGHT */}
        <div className="ml-auto hidden md:flex items-center gap-4">
          <a className="text-[16px] text-[#364153] font-arimo">Register</a>
          <button className="h-[35.99px] rounded-md bg-[#0099ff] px-3 text-[16px] text-white font-arimo whitespace-nowrap">
            Log in
          </button>
        </div>

        {/* HAMBURGER (Mobile only) */}
        <button
          onClick={() => setOpen(!open)}
          className="ml-auto md:hidden flex flex-col gap-[4px]"
        >
          <span className="w-6 h-[2px] bg-black"></span>
          <span className="w-6 h-[2px] bg-black"></span>
          <span className="w-6 h-[2px] bg-black"></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden absolute top-[69px] left-0 w-full bg-white/95 backdrop-blur-md border-t border-[#B8E6FE]/50">
          <nav className="flex flex-col gap-4 p-6 text-[16px] text-[#364153] font-arimo">
            <a href="#">Creator</a>
            <a href="#">Samples</a>
            <a href="#">Prints</a>
            <a href="#">Guide</a>
            <a href="#">Install</a>

            <div className="pt-4 flex gap-4">
              <a className="text-[#364153]">Register</a>
              <button className="rounded-md bg-[#0099ff] px-4 py-2 text-white">
                Log in
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
