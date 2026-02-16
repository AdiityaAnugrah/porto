import React, { useState } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

/**
 * LazyImage Component
 * combines native lazy loading with a smooth framer-motion reveal.
 * 
 * @param {string} src - Image source
 * @param {string} alt - Alt text
 * @param {string} className - CSS classes
 * @param {string} width - Explicit width (optional, good for CLS)
 * @param {string} height - Explicit height (optional, good for CLS)
 */
const LazyImage = ({ src, alt, className = "", ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton / Placeholder (Visible until loaded) */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse z-0" />
      )}

      {/* Actual Image */}
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.05
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover relative z-10 ${className}`}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
