// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("eplacer_users") || "[]");
    setUsers(u);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <div className="space-y-2">
        {users.map(u => (
          <div key={u.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{u.name}</div>
              <div className="text-sm text-gray-500">{u.email}</div>
            </div>
            <div className="text-sm text-gray-500">{u.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
