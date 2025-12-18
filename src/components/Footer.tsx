import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0085CC] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Top links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">

          {/* Column 1 */}
          <div>
            <h4 className="mb-4 text-[16px] font-arimo font-semibold">
              Flipbooks
            </h4>
            <ul className="space-y-2 text-[14px] font-arimo text-white/90">
              <li>Features</li>
              <li>Pricing</li>
              <li>Support center</li>
              <li>Video tutorials</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="mb-4 text-[16px] font-arimo font-semibold">
              Resources
            </h4>
            <ul className="space-y-2 text-[14px] font-arimo text-white/90">
              <li>Blog</li>
              <li>Examples</li>
              <li>Guide</li>
              <li>Changelog</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="mb-4 text-[16px] font-arimo font-semibold">
              Products & Services
            </h4>
            <ul className="space-y-2 text-[14px] font-arimo text-white/90">
              <li>Flipbook creator</li>
              <li>Print on demand service</li>
              <li>PDF to Flipbook</li>
              <li>Templates</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="mb-4 text-[16px] font-arimo font-semibold">
              Company
            </h4>
            <ul className="space-y-2 text-[14px] font-arimo text-white/90">
              <li>About</li>
              <li>Contact</li>
              <li>Careers</li>
              <li>Privacy</li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-white/20" />

        {/* Bottom text */}
        <p className="text-center text-[14px] font-arimo text-[#DFF2FE]">
          © 2024 Heyzine. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
