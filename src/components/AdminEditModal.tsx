import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ref, update } from "firebase/database";
import { db } from "@/firebase";
import { UserType } from "@/pages/Admin";

type Props = {
  user: UserType;
  onClose: () => void;
};

const AdminEditModal: React.FC<Props> = ({ user, onClose }) => {
  const [form, setForm] = useState<UserType>(user);
  const [loading, setLoading] = useState(false);

  // 🔁 Sync when another user is selected
  useEffect(() => {
    setForm(user);
  }, [user]);

  const updateUser = async () => {
    try {
      setLoading(true);
      await update(ref(db, `users/${user.uid}`), {
        name: form.name,
        location: form.location || "",
        company: form.company || "",
      });
      onClose();
    } catch (err) {
      alert("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-4 flex justify-between">
          <h2 className="text-lg font-semibold">Edit User</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <input
            className="input"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            placeholder="Name"
          />

          <input
            className="input"
            value={form.location || ""}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            placeholder="Location"
          />

          <input
            className="input"
            value={form.company || ""}
            onChange={(e) =>
              setForm({ ...form, company: e.target.value })
            }
            placeholder="Company"
          />

          <button
            onClick={updateUser}
            disabled={loading}
            className="w-full rounded-md bg-blue-500 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditModal;
