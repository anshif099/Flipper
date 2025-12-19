import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";


const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-arimo text-[16px] ${
      isActive ? "text-[#0084D1] font-semibold" : "text-[#364153]"
    }`;

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full h-[69px]  bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center px-6">

        {/* LEFT */}
<NavLink
  to="/"
  className="flex items-center gap-2 select-none"
>
  <img
    src={logo}
    alt="Logo"
    className="w-[19.99px] h-[17.99px]"
  />
  <span className="font-arimo font-bold text-[20px] text-[#0A0A0A]">
    Flipbook
  </span>
</NavLink>

        {/* CENTER NAV */}
        <nav className="absolute left-1/2 top-[2.3em] hidden -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-8">
          <NavLink to="/Creator" className={linkClass}>Creator</NavLink>

          <button
            onClick={() => scrollToSection("examples")}
            className="font-arimo text-[16px] text-[#364153] hover:text-[#0084D1]"
          >
            Samples
          </button>

          <NavLink to="/Blog" className={linkClass}>Blog</NavLink>

          <button
            onClick={() => scrollToSection("guide")}
            className="font-arimo text-[16px] text-[#364153] hover:text-[#0084D1]"
          >
            Guide
          </button>
        </nav>

        {/* RIGHT */}
        <div className="ml-auto hidden md:flex items-center gap-4">
          <NavLink to="/Register" className={linkClass}>Register</NavLink>
          <button className="h-[36px] rounded-md bg-[#0099ff] px-3 text-white">
            Log in
          </button>
        </div>

        {/* HAMBURGER */}
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
          <nav className="flex flex-col gap-4 p-6 font-arimo text-[16px]">
            <NavLink to="/Creator" onClick={() => setOpen(false)} className={linkClass}>Creator</NavLink>

            <button onClick={() => scrollToSection("examples")} className="text-left text-[#364153]">
              Samples
            </button>

            <NavLink to="/Blog" onClick={() => setOpen(false)} className={linkClass}>Blog</NavLink>

            <button onClick={() => scrollToSection("guide")} className="text-left text-[#364153]">
              Guide
            </button>

            <div className="pt-4 flex gap-4">
              <NavLink to="/Register" onClick={() => setOpen(false)} className={linkClass}>
                Register
              </NavLink>
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
