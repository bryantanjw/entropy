"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function OutputImage({ path, index, predictionId }) {
  const pathname = usePathname().split("/").pop().slice(0, -1);

  const flag = path.toString() === pathname;

  const [predictions, setPredictions] = useState(() => {
    if (typeof window !== "undefined") {
      const storedPredictions = localStorage.getItem(
        `predictions-${predictionId}`
      );
      return storedPredictions ? JSON.parse(storedPredictions) : null;
    }
    return null;
  });

  // TODO: figure out why the fuck does the exit page transition for image
  // to pop back in not fukcing work???

  return (
    <AnimatePresence mode="wait">
      <motion.div
        layoutId={`wrapper_image_${index}`}
        initial={!flag ? { opacity: 0 } : { y: 50, opacity: 0 }}
        animate={
          !flag
            ? { opacity: 1, transition: { delay: 0.2 } }
            : { y: 0, opacity: 1 }
        }
        exit={!flag ? { opacity: 0 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={"relative w-full"}
        layout
      >
        <Image
          alt={"Entropy image"}
          className={cn(
            "shadow-lg inset-0 h-fit w-full object-contain rounded-md",
            "transition-all duration-200",
            { "hover:scale-95": !flag }
          )}
          width={1200}
          height={1200}
          src={`https://replicate.delivery/yhqm/${path}/out-${index}.png`}
        />
      </motion.div>
    </AnimatePresence>
  );
}
