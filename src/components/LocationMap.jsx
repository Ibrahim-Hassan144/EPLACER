import React from "react";

export default function LocationMap({ query }) {
  const encoded = encodeURIComponent(query);

  return (
    <div className="rounded-xl overflow-hidden shadow mb-4">
      <iframe
        title="Google Maps Location"
        width="100%"
        height="250"
        loading="lazy"
        src={`https://www.google.com/maps?q=${encoded}&output=embed`}
      />
    </div>
  );
}
