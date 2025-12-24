import React from "react";

const ContactSection: React.FC = () => {
  return (
    <section className="w-full bg-[#F6FBFF] py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT CONTENT */}
          <div>
            <h2 className="pt-20 text-[36px] font-arimo text-[#101828] leading-[40px] mb-4">
              Contact Us
            </h2>
            <p className="max-w-md text-[16px] leading-[24px] font-arimo text-[#4A5565]">
              If you have questions about your order, customizations or
              collaborations, you can fill the form below and we will get back
              to you as soon as possible. Average response time is 24 hours.
            </p>
          </div>

          {/* RIGHT FORM */}
          <form className="w-full max-w-xl">

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="mb-2 block text-[16px] leading-[24px] font-arimo text-[#364153]">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="
                    w-full rounded-[8px]
                    border border-[#B8E6FE]
                    bg-white
                    px-4 py-2.5
                    text-[14px] font-arimo
                    placeholder:text-[#9AAAC1]
                    focus:outline-none focus:border-[#0099FF]
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-[16px] leading-[24px] font-arimo text-[#364153]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="
                    w-full rounded-[8px]
                    border border-[#CFE9FF]
                    bg-white
                    px-4 py-2.5
                    text-[14px] font-arimo
                    placeholder:text-[#9AAAC1]
                    focus:outline-none focus:border-[#0099FF]
                  "
                />
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="mb-2 block text-[16px] leading-[24px] font-arimo text-[#364153]">
                Message
              </label>
              <textarea
                placeholder="Your message..."
                rows={5}
                className="
                  w-full rounded-[8px]
                  border border-[#CFE9FF]
                  bg-white
                  px-4 py-3
                  text-[14px] font-arimo
                  placeholder:text-[#9AAAC1]
                  focus:outline-none focus:border-[#0099FF]
                  resize-none
                "
              />
            </div>

            {/* Checkbox */}
            <div className="mb-6 flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#CFE9FF]"
              />
              <label className="mb-2 block text-[16px] leading-[24px] font-arimo text-[#364153]">
                Sign me up for the email newsletter
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="
                rounded-[8px]
                bg-[#00A6F4]
                px-6 py-3
                text-[14px]
                leading-[20px]
                font-arimo font-medium
                text-white
                transition
                hover:bg-[#0085DD]
                active:scale-[0.98]
              "
            >
              Send Message
            </button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
