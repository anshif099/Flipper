import React, { useEffect, useState } from "react";
import { ref, onValue, remove } from "firebase/database";
import { db } from "@/firebase";
import { useNavigate } from "react-router-dom";
import AdminUserRow from "@/components/AdminUserRow";
import AdminEditModal from "@/components/AdminEditModal";

export type UserType = {
  uid: string;
  name: string;
  email: string;
  location?: string;
  company?: string;
  provider: string;
};

const Admin: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // 🔐 ADMIN AUTH CHECK (LOCAL ONLY)
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin-login");
    } else {
      setCheckingAuth(false);
    }
  }, [navigate]);

  // 🔁 LOAD USERS
  useEffect(() => {
    if (checkingAuth) return;

    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList: UserType[] = Object.keys(data).map((key) => ({
          uid: key,
          ...data[key],
        }));
        setUsers(userList);
      } else {
        setUsers([]);
      }
    });

    return () => unsubscribe();
  }, [checkingAuth]);

  const handleDelete = async (uid: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await remove(ref(db, `users/${uid}`));
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <button
            onClick={() => {
              localStorage.removeItem("isAdmin");
              navigate("/admin-login");
            }}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="text-left font-semibold">Email</th>
                <th className="text-left font-semibold">Location</th>
                <th className="text-left font-semibold">Company</th>
                <th className="text-left font-semibold">Provider</th>
                <th className="text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <AdminUserRow
                  key={user.uid}
                  user={user}
                  onEdit={() => setSelectedUser(user)}
                  onDelete={() => handleDelete(user.uid)}
                />
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No users found
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <AdminEditModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Admin;
