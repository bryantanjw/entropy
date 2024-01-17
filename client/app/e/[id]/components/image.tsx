"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function OutputImage({ path, index }) {
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
          className={"shadow-lg h-full w-full object-cover rounded-md"}
          width={720}
          height={720}
          src={`https://replicate.delivery/pbxt/${path}/out-${index}.png`}
        />
      </motion.div>
    </AnimatePresence>
  );
}
