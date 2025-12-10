// src/components/PlacementCard.jsx
import React, { useState, useEffect } from "react";
import { AiFillStar, AiOutlineHeart, AiFillHeart, AiOutlineEnvironment } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function PlacementCard({ item, applied, onApply, onLocationClick }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const reviews = item.reviews ?? Math.floor(Math.random() * 200 + 10);
  const rating = item.rating ?? Math.round((Math.random() * 1.4 + 3.6) * 10) / 10;

  useEffect(() => {
    setSaved(false);
  }, [item._id]);

  function handleApplyClick() {
    if (item.type === "internship") {
      if (onApply) onApply(item);
      else navigate(`/internships/apply/${item._id}`);
      return;
    }
    if (onApply) onApply(item);
  }

  const displayImage = item.image || item.logo || "/placeholder.png";

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <img src={displayImage} alt={item.title || item.company} className="w-full h-44 object-cover transition-transform duration-500 hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

        <button onClick={() => setSaved(s => !s)} className="absolute right-3 top-3 bg-white/90 p-2 rounded-full shadow-md hover:scale-110 transition">
          {saved ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart className="text-gray-700" />}
        </button>

        <div className="absolute left-3 bottom-3 bg-white px-3 py-1 rounded-full shadow font-semibold text-sm">
          {item.slots} slots
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center">
          <div
            className={item.type === "cs" ? "text-sm text-primary flex items-center gap-1 cursor-pointer hover:underline" : "text-sm text-gray-500 flex items-center gap-1"}
            onClick={() => {
              if (item.type === "cs" && onLocationClick) onLocationClick(item);
            }}
          >
            <AiOutlineEnvironment /> {item.location}
          </div>

          <div className="flex items-center gap-1">
            <AiFillStar className="text-yellow-400" />
            <span className="font-semibold">{rating}</span>
            <span className="text-sm text-gray-500">{reviews}</span>
          </div>
        </div>

        <h3 className="mt-2 font-semibold text-[16px] text-gray-800 leading-tight">
          {item.title || item.company}
        </h3>

        <div className="mt-4 flex justify-between items-center">
          <button onClick={handleApplyClick} disabled={applied} className={"px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-sm " + (applied ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90 hover:shadow")}>
            {applied ? "Applied ✓" : "Apply"}
          </button>

          <span className="font-semibold text-primary text-[15px]">{item.slots} left</span>
        </div>
      </div>
    </div>
  );
}
