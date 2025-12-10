// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/applications" className="p-4 bg-white rounded shadow hover:shadow-md">
          Manage Applications
        </Link>
        <Link to="/admin/placements" className="p-4 bg-white rounded shadow hover:shadow-md">
          Manage Placements
        </Link>
        <Link to="/admin/users" className="p-4 bg-white rounded shadow hover:shadow-md">
          Manage Users (demo)
        </Link>
      </div>
    </div>
  );
}
