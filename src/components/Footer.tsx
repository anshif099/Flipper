import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0085CC] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        
        {/* Top links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:pl-40">

          {/* Column 1 */}
          <div>
            <h4 className="mb-3 sm:mb-4 text-sm sm:text-base font-arimo font-semibold">
              Flipbooks
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-sm font-arimo text-white/90">
              <li className="hover:text-white cursor-pointer transition-colors">Features</li>
              <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
              <li className="hover:text-white cursor-pointer transition-colors">Support center</li>
              <li className="hover:text-white cursor-pointer transition-colors">Video tutorials</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="mb-3 sm:mb-4 text-sm sm:text-base font-arimo font-semibold">
              Resources
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-sm font-arimo text-white/90">
              <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
              <li className="hover:text-white cursor-pointer transition-colors">Examples</li>
              <li className="hover:text-white cursor-pointer transition-colors">Guide</li>
              <li className="hover:text-white cursor-pointer transition-colors">Changelog</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="mb-3 sm:mb-4 text-sm sm:text-base font-arimo font-semibold">
              Products & Services
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-sm font-arimo text-white/90">
              <li className="hover:text-white cursor-pointer transition-colors">Flipbook creator</li>
              <li className="hover:text-white cursor-pointer transition-colors">Print on demand service</li>
              <li className="hover:text-white cursor-pointer transition-colors">PDF to Flipbook</li>
              <li className="hover:text-white cursor-pointer transition-colors">Templates</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="mb-3 sm:mb-4 text-sm sm:text-base font-arimo font-semibold">
              Company
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-sm font-arimo text-white/90">
              <li className="hover:text-white cursor-pointer transition-colors">About</li>
              <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
              <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-white/20" />

        {/* Bottom text */}
        <p className="text-center text-sm sm:text-sm font-arimo text-[#DFF2FE]">
          © 2024 Heyzine. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;