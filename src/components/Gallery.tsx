"use client";

import { useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="tile gallery-main" />;
  return (
    <div className="gallery">
      <div className="tile gallery-main">
        <img src={images[active]} alt={alt} />
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              className={`tile thumb${i === active ? " is-active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === active}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
