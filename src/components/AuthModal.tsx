import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "@/firebase";

type AuthModalProps = {
  onClose?: () => void;
  mode?: "login" | "register";
};

const AuthModal: React.FC<AuthModalProps> = ({ onClose, mode }) => {
  const [currentMode, setCurrentMode] = useState<"login" | "register">(
    mode ?? "login"
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    location: "",
    company: "",
  });

  useEffect(() => {
    if (mode) setCurrentMode(mode);
  }, [mode]);

  // ✅ FIXED INPUT HANDLER
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      onClose?.();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 📝 REGISTER
  const handleRegister = async () => {
    if (form.password !== form.repeatPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await set(ref(db, `users/${res.user.uid}`), {
        uid: res.user.uid,
        name: form.name,
        email: form.email,
        location: form.location,
        company: form.company || "",
        provider: "email",
        createdAt: Date.now(),
      });

      onClose?.();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 🔵 GOOGLE AUTH
  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      await set(ref(db, `users/${res.user.uid}`), {
        uid: res.user.uid,
        name: res.user.displayName,
        email: res.user.email,
        photo: res.user.photoURL,
        provider: "google",
        createdAt: Date.now(),
      });

      onClose?.();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentMode === "login" ? "Log In" : "Register"}
          </h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-2 rounded-md border py-2 text-sm hover:bg-gray-50"
        >
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
          <div className="space-y-3">
            <input
              className="input"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              className="input"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <button
              onClick={handleLogin}
              className="w-full rounded-md bg-blue-500 py-2 text-white"
            >
              Log In
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              className="input"
              name="name"
              placeholder="Name"
              onChange={handleChange}
            />
            <input
              className="input"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              className="input"
              name="location"
              placeholder="Location"
              onChange={handleChange}
            />
            <input
              className="input"
              name="company"
              placeholder="Company"
              onChange={handleChange}
            />
            <input
              className="input"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <input
              className="input"
              name="repeatPassword"
              type="password"
              placeholder="Repeat Password"
              onChange={handleChange}
            />

            <button
              onClick={handleRegister}
              className="w-full rounded-md bg-blue-500 py-2 text-white"
            >
              Register
            </button>
          </div>
        )}

        {/* Switch */}
        <p className="mt-4 text-center text-xs text-gray-600">
          {currentMode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setCurrentMode("register")}
                className="text-blue-500"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setCurrentMode("login")}
                className="text-blue-500"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
