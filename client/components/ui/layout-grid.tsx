"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Card = {
  id: number;
  url: string;
};

export const LayoutGrid = ({ data }: { data: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);

  return (
    <div className="w-full h-full pt-0 p-12 grid grid-cols-1 md:grid-cols-4 gap-5">
      {data.map((card, i) => (
        <div key={i} className={cn("col-span-1")}>
          <motion.div
            onClick={() => {
              setSelected(card);
            }}
            className={cn(
              "col-span-1",
              "relative overflow-hidden",
              selected?.id === card.id
                ? "absolute inset-0 w-full md:w-1/2 m-auto z-50 justify-center items-center"
                : "bg-white h-full w-full"
            )}
            layout
          >
            {selected?.id === card.id && <SelectedCard selected={selected} />}
            <BlurImage card={card} />
          </motion.div>
        </div>
      ))}
      <motion.div
        onClick={() => {
          setSelected(null);
        }}
        className={cn(
          "absolute h-full w-full left-0 top-0 bg-black opacity-0 z-40",
          selected?.id ? "pointer-events-auto" : "pointer-events-none"
        )}
        animate={{ opacity: selected?.id ? 0.3 : 0 }}
      />
    </div>
  );
};

const BlurImage = ({ card }: { card: Card }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={card.url}
      height="1080"
      width="720"
      quality={100}
      onLoad={() => setLoaded(true)}
      className={cn(
        "cursor-pointer object-cover object-top absolute inset-0 rounded-lg h-full w-full transition duration-200 hover:scale-95",
        loaded ? "blur-none" : "blur-md"
      )}
      alt="thumbnail"
    />
  );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.6,
        }}
        className="absolute inset-0 h-full w-full z-10"
      />
      <motion.div
        initial={{
          opacity: 0,
          y: 100,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="relative px-8 pb-4 z-[70]"
      >
        hi
      </motion.div>
    </div>
  );
};
