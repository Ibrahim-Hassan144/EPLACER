import React from "react";

export default function SidePanel({ open, onClose, children }) {
  return (
    <div
      className={`fixed inset-0 z-40 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* BACKDROP */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* SIDE DRAWER */}
      <div
        className={`absolute right-0 top-0 h-full w-[90%] sm:w-[380px] bg-white shadow-xl 
        transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="text-xl font-semibold">Location Details</h3>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>

        <div className="p-4 overflow-y-auto h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
