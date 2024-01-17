"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DownloadIcon, StarIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function OutputImage({ path, index }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AnimatePresence key={index} mode="wait" initial={false}>
      <motion.div
        layoutId={`wrapper_image_${index}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.2 } }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={"relative w-full h-full"}
      >
        <Image
          alt={"Entropy image"}
          className={cn(
            "shadow-lg h-full w-full object-cover rounded-md",
            "duration-300 ease-in-out",
            isLoading ? "scale-102 blur-md" : "scale-100 blur-0"
          )}
          onLoad={() => setIsLoading(false)}
          width={720}
          height={720}
          src={`https://replicate.delivery/pbxt/${path}/out-${index}.png`}
        />
      </motion.div>
    </AnimatePresence>
  );
}
