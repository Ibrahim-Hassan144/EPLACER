// src/pages/MyApplications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    try {
      setLoading(true);
      const token = localStorage.getItem("eplacer_token");
      const res = await axios.get(`${API}/applications/me/list`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setApps(res.data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
      setApps([]);
      alert("Unable to load applications (are you logged in?)");
    } finally {
      setLoading(false);
    }
  }

  async function cancel(a) {
    if (!confirm("Cancel this application?")) return;
    try {
      const token = localStorage.getItem("eplacer_token");
      await axios.delete(`${API}/applications/${a._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      alert("Cancelled");
      load();
    } catch (err) {
      console.error(err);
      alert("Cancel failed");
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Applications</h2>

      {loading ? (
        <div>Loading...</div>
      ) : apps.length === 0 ? (
        <div>No applications yet.</div>
      ) : (
        <div className="grid gap-4">
          {apps.map((a) => {
            const logo = a.placementId?.image || a.internshipId?.logo || "/placeholder.png";
            const name = a.placementId?.title || a.internshipId?.company || "Placement";
            return (
              <div key={a._id} className="bg-white p-4 rounded shadow flex justify-between">
                <div className="flex gap-4 items-center">
                  <img src={logo} className="w-16 h-16 rounded" alt={name} />
                  <div>
                    <div className="font-semibold">{name}</div>
                    <div className="text-sm text-gray-500">{new Date(a.appliedAt).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <span
                    className={
                      "px-3 py-1 rounded-full text-sm " +
                      (a.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : a.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800")
                    }
                  >
                    {a.status}
                  </span>

                  <button className="border px-3 py-2 rounded" onClick={() => cancel(a)}>
                    Cancel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
