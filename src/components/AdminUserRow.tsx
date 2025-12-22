import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { UserType } from "@/pages/Admin";

type Props = {
  user: UserType;
  onEdit: () => void;
  onDelete: () => void;
};

const AdminUserRow: React.FC<Props> = ({ user, onEdit, onDelete }) => {
  return (
    <tr className="border-t text-gray-700">
      <td className="p-4 font-medium">{user.name}</td>
      <td>{user.email}</td>
      <td>{user.location || "-"}</td>
      <td>{user.company || "-"}</td>
      <td className="capitalize">{user.provider}</td>
      <td className="p-4 text-right space-x-3">
        <button
          onClick={onEdit}
          className="text-blue-500 hover:underline"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:underline"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};

export default AdminUserRow;
