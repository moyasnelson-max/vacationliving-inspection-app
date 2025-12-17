"use client";

import { motion } from "framer-motion";

export default function Stagger({ children }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.08 }
        }
      }}
    >
      {children}
    </motion.div>
  );
}
