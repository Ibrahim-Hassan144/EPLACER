import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import csData from "../data/csSites";
import internshipData from "../data/internshipSites";

export default function Home() {
  const nav = useNavigate();

  // Combine CS images & internship logos for slideshow
  const slideshow = [
    ...csData.slice(0, 4).map(i => i.image),
    ...internshipData.slice(0, 4).map(i => i.image),
  ];

  const [index, setIndex] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slideshow.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>

      {/* HERO SECTION */}
      <section className="relative bg-white p-8 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-center overflow-hidden">

        {/* TEXT */}
        <div className="z-10 max-w-xl">
          <h1 className="text-4xl font-bold leading-tight text-gray-800">
            Find community service & internship placements
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Browse curated community service sites and internship partners. Apply with one click.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => nav("/placements/cs")}
              className="bg-primary text-white px-5 py-3 rounded-lg shadow hover:bg-primary/90"
            >
              Browse CS Placements
            </button>

            <button
              onClick={() => nav("/placements/internships")}
              className="border border-primary text-primary px-5 py-3 rounded-lg hover:bg-primary/10"
            >
              Browse Internships
            </button>
          </div>
        </div>

        {/* SLIDESHOW IMAGE */}
        <div className="absolute md:static right-0 top-0 bottom-0 w-full md:w-auto h-60 md:h-auto opacity-70 md:opacity-100">
          <img
            src={slideshow[index]}
            className="w-full md:w-96 h-full object-cover rounded-xl shadow-xl transition-opacity duration-700"
          />
        </div>

      </section>

      {/* EXPLORE SECTION */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Explore placements near you</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {csData.slice(0, 4).map((s) => (
            <div key={s.id}>
              <img
                src={s.image}
                alt={s.title}
                className="rounded-xl shadow-md w-full h-44 object-cover hover:scale-[1.02] transition"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
