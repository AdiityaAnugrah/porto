import React, { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const MouseGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        background: `radial-gradient(600px circle at ${smoothX}px ${smoothY}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
      }}
    />
  );
};

export default MouseGlow;
