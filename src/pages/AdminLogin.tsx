import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "admin@yourapp.com"; // 🔐 change this

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginAdmin = async () => {
    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, password);

      // 🔒 Verify admin email
      if (res.user.email !== ADMIN_EMAIL) {
        alert("Not authorized as admin");
        await auth.signOut();
        return;
      }

      navigate("/admin");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6fbff]">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">

        <h2 className="mb-4 text-xl font-semibold text-center">
          Admin Login
        </h2>

        <div className="space-y-3">
          <input
            className="input"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={loginAdmin}
            disabled={loading}
            className="w-full rounded-md bg-blue-500 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
