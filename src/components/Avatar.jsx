// src/components/Avatar.jsx
import React from "react";
import "./Avatar.scss";

/**
 * Avatar: foto 1:1 dengan ring gradasi & subtle overlay supaya nyatu ke tema.
 * Props:
 * - srcBase: path tanpa ekstensi (akan dicoba .avif, .webp, .jpg)
 * - alt: teks alternatif
 * - size: px (default 160)
 */
const Avatar = ({ srcBase = "/assets/me-sunset", alt = "Profile photo", size = 160 }) => {
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      <picture>
        <source srcSet={`${srcBase}.avif`} type="image/avif" />
        <source srcSet={`${srcBase}.webp`} type="image/webp" />
        <img
          src={`${srcBase}.jpg`}
          alt={alt}
          loading="lazy"
          decoding="async"
          width={size}
          height={size}
        />
      </picture>
    </div>
  );
};

export default Avatar;
