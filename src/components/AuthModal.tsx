import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

type AuthModalProps = {
  onClose?: () => void;
  mode?: "login" | "register";
};

const AuthModal: React.FC<AuthModalProps> = ({ onClose, mode }) => {
  const [currentMode, setCurrentMode] = useState<"login" | "register">(
    mode ?? "login"
  );

  // 🔁 Sync every time Header changes mode
  useEffect(() => {
    if (mode) setCurrentMode(mode);
  }, [mode]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentMode === "login" ? "Log In" : "Register"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Google */}
        <button className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 py-2 text-sm hover:bg-gray-50">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="h-4 w-4"
          />
          {currentMode === "login"
            ? "Sign in with Google"
            : "Sign up with Google"}
        </button>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
          <div className="h-px flex-1 bg-gray-200" />
          Or use your email
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Forms */}
        {currentMode === "login" ? (
          <form className="space-y-3">
            <input className="input" placeholder="Email" />
            <input className="input" placeholder="Password" type="password" />

            <div className="text-right text-xs">
              <a className="text-blue-500 hover:underline">Forgot password?</a>
            </div>

            <button className="w-full rounded-md bg-blue-500 py-2 text-white">
              Log In
            </button>
          </form>
        ) : (
          <form className="space-y-3">
            <input className="input" placeholder="Name" />
            <input className="input" placeholder="Email" />
            <input className="input" placeholder="Location" />
            <input className="input" placeholder="Company name (optional)" />
            <input className="input" placeholder="Password" type="password" />
            <input className="input" placeholder="Repeat password" type="password" />

            <button className="w-full rounded-md bg-blue-500 py-2 text-white">
              Register
            </button>
          </form>
        )}

        {/* Footer switch */}
        <p className="mt-4 text-center text-xs text-gray-600">
          {currentMode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setCurrentMode("register")}
                className="text-blue-500 hover:underline"
              >
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setCurrentMode("login")}
                className="text-blue-500 hover:underline"
              >
                Login here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
