import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "admin@flipbook.com";
const ADMIN_PASSWORD = "Admin@123";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginAdmin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      setError("Invalid admin email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">

        <h2 className="mb-4 text-center text-xl font-semibold">
          Admin Login
        </h2>

        {error && (
          <p className="mb-3 text-sm text-red-500">{error}</p>
        )}

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
            className="w-full rounded-md bg-blue-500 py-2 text-white"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
