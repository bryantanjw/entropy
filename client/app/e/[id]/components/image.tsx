"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function OutputImage({ path, index }) {
  const pathname = usePathname().split("/").pop().slice(0, -1);

  const flag = path.toString() === pathname;

  // TODO: figure out why the fuck the exit/back page transition for image
  // to pop back in doesn't fukcing work???

  return (
    <AnimatePresence mode="wait">
      <motion.div
        layoutId={`wrapper_image_${index}`}
        initial={!flag ? { opacity: 0 } : { y: -50, opacity: 0 }}
        animate={
          !flag
            ? { opacity: 1, transition: { delay: 0.2 } }
            : { y: 0, opacity: 1 }
        }
        exit={!flag ? { opacity: 0 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={"relative w-full h-full"}
      >
        <Image
          alt={"Entropy image"}
          className={cn(
            "shadow-lg h-full w-full object-cover rounded-md",
            "duration-300 ease-in-out"
          )}
          width={720}
          height={720}
          src={`https://replicate.delivery/pbxt/${path}/out-${index}.png`}
        />
      </motion.div>
    </AnimatePresence>
  );
}
