import React, { useEffect, useState } from "react";
import api from "../../utils/api";  // <-- use shared axios instance

export default function AdminApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get("/applications"); // token included automatically
      setApps(res.data);
    } catch (err) {
      console.error("ADMIN LOAD ERROR:", err);
      alert("Failed to load applications");
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.put(`/applications/${id}/status`, { status }); // token included
      load();
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
      alert("Failed to update status");
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Applications</h2>

      {apps.length === 0 ? (
        <div>No applications yet.</div>
      ) : (
        <div className="space-y-4">
          {apps.map((a) => {
            const title =
              a.placementId?.title ||
              a.internshipId?.company ||
              "Unknown";

            return (
              <div
                key={a._id}
                className="bg-white p-4 rounded shadow flex justify-between"
              >
                <div>
                  <div className="font-semibold">
                    {title} — {a.fullname}
                  </div>

                  <div className="text-sm text-gray-600">{a.email}</div>

                  <div className="text-sm text-gray-500">
                    Status: {a.status}
                  </div>

                  {a.cvPath && (
                    <a
                      href={a.cvPath}
                      className="text-primary underline"
                      target="_blank"
                    >
                      View CV
                    </a>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => updateStatus(a._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => updateStatus(a._id, "rejected")}
                  >
                    Reject
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
