"use client";

import { motion } from "framer-motion";

export default function ButtonMotion({ children }) {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.12 }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}
