// src/pages/PlacementsInternships.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import PlacementCard from "../components/PlacementCard";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ---- CATEGORY MAP (our categorization rules) ---- //
const CATEGORY_MAP = {
  // TECH
  google: "Tech",
  microsoft: "Tech",
  ibm: "Tech",
  safaricom: "Tech",

  // FINANCE
  equity: "Finance",
  kpmg: "Finance",
  deloitte: "Finance",
  britam: "Finance",
  ncba: "Finance",

  // NGO / DEVELOPMENT
  undp: "NGO / Development",
  unicef: "NGO / Development",
  redcross: "NGO / Development",
  amref: "NGO / Development",

  // MARKETING
  ogilvy: "Marketing",
  scanad: "Marketing",

  // HEALTH
  amrefHealth: "Health",

  // TELECOM
  safaricomTel: "Telecom",
};

function detectCategory(companyName = "") {
  const key = companyName.toLowerCase().replace(/\s+/g, "");
  for (const k in CATEGORY_MAP) {
    if (key.includes(k)) return CATEGORY_MAP[k];
  }
  return "Other";
}

export default function PlacementsInternships() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollerRefs = useRef({});

  useEffect(() => {
    fetchInternships();
  }, []);

  async function fetchInternships() {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/internships`);

      // Normalize and categorize
      const data = res.data.map((x) => ({
        ...x,
        type: "internship",
        category: detectCategory(x.company || x.title || ""),
      }));

      setItems(data);

      // Count items per category
      const counts = {};
      data.forEach((i) => {
        const cat = i.category || "Other";
        counts[cat] = (counts[cat] || 0) + 1;
      });

      // Desired sorting:
      // 1. Tech ALWAYS first
      // 2. Others sorted by count desc
      const sorted = Object.keys(counts)
        .filter((c) => c !== "Tech")
        .sort((a, b) => counts[b] - counts[a]);

      const finalOrder = ["Tech", ...sorted];

      setCategories(finalOrder);
    } catch (err) {
      console.error(err);
      alert("Failed to load internships.");
    } finally {
      setLoading(false);
    }
  }

  function scroll(category, dir) {
    const ref = scrollerRefs.current[category];
    if (!ref) return;

    ref.scrollBy({
      left: dir === "left" ? -350 : 350,
      behavior: "smooth",
    });
  }

  return (
    <div className="px-2 md:px-4">
      <h2 className="text-3xl font-semibold mb-6">Internship Placements</h2>

      {loading ? (
        <div>Loading internships...</div>
      ) : (
        categories.map((category) => (
          <div key={category} className="mb-12">
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="text-xl font-semibold">{category}</h3>
            </div>

            <div className="relative">
              <button
                onClick={() => scroll(category, "left")}
                className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
              >
                <AiOutlineLeft size={22} />
              </button>

              <div
                ref={(el) => (scrollerRefs.current[category] = el)}
                className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth pb-3"
              >
                {items
                  .filter((i) => i.category === category)
                  .map((item) => (
                    <div key={item._id} className="min-w-[270px] md:min-w-[300px]">
                      <PlacementCard
                        item={item}
                        applied={false}
                        onApply={() =>
                          navigate(`/internships/apply/${item._id}`)
                        }
                      />
                    </div>
                  ))}
              </div>

              <button
                onClick={() => scroll(category, "right")}
                className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
              >
                <AiOutlineRight size={22} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
