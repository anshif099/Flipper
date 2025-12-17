import React from "react";
import logo from "@/assets/logo.png";

const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 z-50 w-full h-[69px] border-[1.21px] border-[#B8E6FE]/50 bg-white/70 backdrop-blur-md">
            <div className="mx-auto flex h-full max-w-7xl items-center px-6">

                {/* LEFT + CENTER together */}
                <div className="flex items-center gap-12">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Logo" className="w-[19.99px] h-[17.99px]" />
                        <span className="font-arimo font-bold text-[20px] leading-[28px] text-[#0A0A0A]">
                            Flipbook
                        </span>
                    </div>

                    <nav className="absolute left-1/2 top-[2.3em] hidden -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-8 text-[16px] text-[#364153] font-arimo">
                        <a href="#">Creator</a>
                        <a href="#">Samples</a>
                        <a href="#">Prints</a>
                        <a href="#">Guide</a>
                        <a href="#">Install</a>
                    </nav>

                </div>

                {/* RIGHT */}
                <div className="ml-auto flex items-center gap-4">
                    <a className="text-[16px] text-[#364153] font-arimo">Register</a>
                    <button className="h-[35.99px] rounded-md bg-[#0099ff] px-3 text-[16px] text-white font-arimo whitespace-nowrap">
                        Log in
                    </button>
                </div>
            </div>

        </header>
    );
};

export default Header;
