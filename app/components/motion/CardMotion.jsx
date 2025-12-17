"use client";

import { motion } from "framer-motion";

export default function CardMotion({ children }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 18px 40px rgba(0,0,0,0.08)"
      }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{ borderRadius: "18px" }}
    >
      {children}
    </motion.div>
  );
}
