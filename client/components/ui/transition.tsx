"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

function Transition({ children }: { children: ReactNode }) {
  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.main
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ type: "linear" }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

export default Transition;
