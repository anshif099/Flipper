import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/firebase";
import logo from "@/assets/logo.png";
import AuthModal from "@/components/AuthModal";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<User | null>(null);

  const location = useLocation();

  // 🔐 Listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

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
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full h-[69px] bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center px-6">

          {/* LEFT */}
          <NavLink to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-[19.99px] h-[17.99px]" />
            <span className="font-arimo font-bold text-[20px]">Flipbook</span>
          </NavLink>

          {/* CENTER */}
          <nav className="absolute left-1/2 top-[2.3em] hidden -translate-x-1/2 -translate-y-1/2 md:flex gap-8">
            <NavLink to="/Creator" className={linkClass}>Creator</NavLink>

            <button
              onClick={() => scrollToSection("examples")}
              className="font-arimo text-[16px] text-[#364153]"
            >
              Samples
            </button>

            <NavLink to="/Blog" className={linkClass}>Blog</NavLink>

            <button
              onClick={() => scrollToSection("guide")}
              className="font-arimo text-[16px] text-[#364153]"
            >
              Guide
            </button>
          </nav>

          {/* RIGHT */}
          <div className="ml-auto hidden md:flex items-center gap-4">

            {/* 👤 LOGGED IN */}
            {user ? (
              <>
                <span className="font-arimo text-[15px] text-[#364153]">
                  Hi, {user.displayName || user.email?.split("@")[0]}
                </span>

                <button
                  onClick={handleLogout}
                  className="h-[36px] rounded-md border border-red-500 px-3 text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* ❌ NOT LOGGED IN */}
                <button
                  onClick={() => {
                    setAuthMode("register");
                    setAuthOpen(true);
                  }}
                  className="font-arimo text-[16px] text-[#364153]"
                >
                  Register
                </button>

                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthOpen(true);
                  }}
                  className="h-[36px] rounded-md bg-[#0099ff] px-3 text-white"
                >
                  Log in
                </button>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className="ml-auto md:hidden"
          >
            ☰
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />

          <div className="fixed left-0 right-0 top-[69px] z-40 bg-white shadow-lg md:hidden">
            <nav className="flex flex-col p-6 gap-4">

              <NavLink to="/Creator" className={linkClass} onClick={() => setOpen(false)}>
                Creator
              </NavLink>

              <button
                onClick={() => scrollToSection("examples")}
                className="font-arimo text-[16px] text-[#364153] text-left"
              >
                Samples
              </button>

              <NavLink to="/Blog" className={linkClass} onClick={() => setOpen(false)}>
                Blog
              </NavLink>

              <button
                onClick={() => scrollToSection("guide")}
                className="font-arimo text-[16px] text-[#364153] text-left"
              >
                Guide
              </button>

              <div className="border-t my-2" />

              {user ? (
                <>
                  <span className="text-sm text-gray-600">
                    Logged in as {user.displayName || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode("register");
                      setAuthOpen(true);
                      setOpen(false);
                    }}
                    className="font-arimo text-[16px] text-left text-[#364153]"
                  >
                    Register
                  </button>

                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setAuthOpen(true);
                      setOpen(false);
                    }}
                    className="h-[36px] rounded-md bg-[#0099ff] px-3 text-white font-arimo"
                  >
                    Log in
                  </button>
                </>
              )}
            </nav>
          </div>
        </>
      )}

      {/* AUTH MODAL */}
      {authOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
