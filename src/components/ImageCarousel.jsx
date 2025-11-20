import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE } from "../services/api";

const ImageCarousel = ({ interval = 5000 }) => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [brokenImages, setBrokenImages] = useState({});

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    axios.get(`${API_BASE}/sliders/`)
      .then((res) => setSlides(res.data))
      .catch((err) => console.error("Failed to fetch sliders", err));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, slides.length]);

  if (!slides.length) return (
    <div className="flex flex-col items-center justify-center py-8">
      <svg
        className="animate-spin h-8 w-8 text-blue-500 mb-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <p className="text-gray-500 text-sm">Loading brands...</p>
    </div>
  );

  return (
    
      <div className="relative w-full aspect-[16/9] sm:aspect-[16/7] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-black">
        {slides.map((item, index) => {
          const isActive = index === current;
          const isBroken = brokenImages[item.id];

          return (
            <div
              key={item.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out 
                ${isActive ? "opacity-100 scale-105 z-10" : "opacity-0 scale-100 z-0"}
              `}
            >
              {!isBroken ? (
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                  onError={() =>
                    setBrokenImages((prev) => ({ ...prev, [item.id]: true }))
                  }
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xl font-semibold">
                  {item.alt || "Image not available"}
                </div>
              )}
            </div>
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30 z-20" />

        <button onClick={prev} className="absolute top-1/2 left-4 -translate-y-1/2 p-3 bg-white/20 text-white rounded-full backdrop-blur-md ring-1 ring-white/30 z-30">
          <ChevronLeft />
        </button>
        <button onClick={next} className="absolute top-1/2 right-4 -translate-y-1/2 p-3 bg-white/20 text-white rounded-full backdrop-blur-md ring-1 ring-white/30 z-30">
          <ChevronRight />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full ring-1 ring-white transition-all ${current === i ? "bg-white scale-125" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>
   
  );
};

export default ImageCarousel;
