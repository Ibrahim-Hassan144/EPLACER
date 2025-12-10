// src/pages/PlacementsCS.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PlacementCard from "../components/PlacementCard";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import SidePanel from "../components/SidePanel";
import LocationMap from "../components/LocationMap";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PlacementsCS() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [userApps, setUserApps] = useState([]);

  const scrollerRefs = useRef({});

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const res = await axios.get(`${API}/placements`);
      const data = (res.data || []).map((p) => ({ ...p, type: "cs" }));

      const rawCats = [...new Set(data.map((x) => x.category || "Other"))];
      const preferred = ["Children", "Health", "Special Needs", "Rehab", "Other"];
      const sorted = [
        ...preferred.filter((c) => rawCats.includes(c)),
        ...rawCats.filter((c) => !preferred.includes(c)),
      ];

      setItems(data);
      setCategories(sorted);

      // Fetch applied apps
      const token = localStorage.getItem("eplacer_token");
      if (token) {
        const ares = await axios.get(`${API}/applications/me/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserApps(ares.data || []);
      }
    } catch (err) {
      console.error("Failed to load placements:", err);
    }
  }

  function openPanel(item) {
    setSelected(item);
    setPanelOpen(true);
  }

  function scroll(category, dir) {
    const ref = scrollerRefs.current[category];
    if (!ref) return;

    ref.scrollBy({
      left: dir === "left" ? -350 : 350,
      behavior: "smooth",
    });
  }

  function isApplied(item) {
    return userApps.some(
      (a) =>
        (a.placementId && String(a.placementId._id) === String(item._id)) ||
        (a.internshipId && String(a.internshipId._id) === String(item._id))
    );
  }

  async function applyCS(item) {
    const token = localStorage.getItem("eplacer_token");
    if (!token) return alert("Please login to apply.");

    try {
      const fd = new FormData();
      fd.append("placementId", item._id);
      fd.append("fullname", "Student User");
      fd.append("email", "student@school.com");
      fd.append("phone", "N/A");
      fd.append("cover", "");

      await axios.post(`${API}/applications`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const ares = await axios.get(`${API}/applications/me/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserApps(ares.data || []);
      loadAll();

      alert("Application submitted!");
    } catch (err) {
      console.log(err);
      alert("Apply failed.");
    }
  }

  return (
    <div className="px-2 md:px-4">
      <h2 className="text-3xl font-semibold mb-6">Community Service Placements</h2>

      {categories.map((category) => (
        <div key={category} className="mb-12">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-xl font-semibold">{category}</h3>
          </div>

          <div className="relative">
            <button
              onClick={() => scroll(category, "left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow rounded-full p-2"
            >
              <AiOutlineLeft size={22} />
            </button>

            <div
              ref={(el) => (scrollerRefs.current[category] = el)}
              className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth pb-3"
            >
              {items
                .filter((i) => (i.category || "Other") === category)
                .map((item) => (
                  <div key={item._id} className="min-w-[270px] md:min-w-[300px]">
                    <PlacementCard
                      item={item}
                      applied={isApplied(item)}
                      onApply={() => applyCS(item)}
                      onLocationClick={openPanel}
                    />
                  </div>
                ))}
            </div>

            <button
              onClick={() => scroll(category, "right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow rounded-full p-2"
            >
              <AiOutlineRight size={22} />
            </button>
          </div>
        </div>
      ))}

      <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)}>
        {selected && (
          <>
            <LocationMap query={`${selected.title} ${selected.location}`} />
            <h3 className="text-xl font-semibold mb-1">{selected.title}</h3>
            <p className="text-gray-600 mb-3">{selected.location}</p>

            <p><strong>Phone:</strong> {selected.phone || "Not provided"}</p>
            <p><strong>Email:</strong> {selected.email || "Not provided"}</p>
          </>
        )}
      </SidePanel>
    </div>
  );
}
