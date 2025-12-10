// src/pages/admin/AdminPlacements.jsx
import React, { useEffect, useState } from "react";
import csData from "../../data/csSites";
import internshipData from "../../data/internshipSites";

/**
 * AdminPlacements:
 * - merges base data with local custom overrides from localStorage
 * - allows editing slots and deleting (soft delete via local storage)
 */

const CUSTOM_KEY = "eplacer_placements_custom";

export default function AdminPlacements() {
  const [custom, setCustom] = useState({});
  const [items, setItems] = useState([]);

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem(CUSTOM_KEY) || "{}");
    setCustom(c);
  }, []);

  useEffect(() => {
    // merge base arrays
    const base = [...csData, ...internshipData];
    const merged = base.map(b => ({ ...b, ...((custom[b.id]) || {}) }));
    setItems(merged);
  }, [custom]);

  function saveCustom(newCustom) {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(newCustom));
    setCustom(newCustom);
  }

  function updateSlots(id, slots) {
    const nc = { ...custom, [id]: { ...(custom[id] || {}), slots } };
    saveCustom(nc);
  }

  function removePlacement(id) {
    const nc = { ...custom, [id]: { ...(custom[id] || {}), _deleted: true } };
    saveCustom(nc);
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Placements</h2>

      <div className="space-y-3">
        {items.map(it => {
          if (custom[it.id]?._deleted) return null;
          return (
            <div key={it.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm text-gray-600">{it.category} — {it.location}</div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={it.slots}
                  onChange={(e) => updateSlots(it.id, Math.max(0, Number(e.target.value)))}
                  className="w-20 px-2 py-1 rounded border"
                />
                <button onClick={() => removePlacement(it.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
