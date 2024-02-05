"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const styles = [
  { _id: 1, style: "anime" },
  { _id: 2, style: "realism" },
  { _id: 3, style: "3d" },
  { _id: 4, style: "digital" },
];

export default function Filter({
  search,
  style,
}: {
  search?: string;
  style?: string;
}) {
  const router = useRouter();

  const [text, setText] = useState(search || "");
  const [selectedStyle, setSelectedStyle] = useState(style || "");

  const handleSearch = (event) => {
    event.preventDefault();
    if (!text) {
      router.push(`/`, { scroll: false });
    } else {
      router.push(`/images?search=${text}&style=${selectedStyle}`, {
        scroll: false,
      });
    }
  };

  useEffect(() => {
    if (selectedStyle) {
      router.push(`/images?search=${text}&style=${selectedStyle}`, {
        scroll: false,
      });
    }
  }, [selectedStyle]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      className="text-sm flex flex-col md:flex-row gap-6 md:gap-0 justify-between w-full items-center"
    >
      <form onSubmit={handleSearch} className="relative w-[350px] md:w-[300px]">
        <input
          name="search"
          type="text"
          value={text}
          className="px-9 flex h-9 w-full rounded-md border border-input bg-transparent py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Search..."
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <div
          className="absolute inset-y-0 left-0 pl-2  
              flex items-center  
              pointer-events-none"
        >
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
        </div>
        {text && (
          <div
            className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
            onClick={() => {
              setText("");
              router.push(`/images?search=&style=${selectedStyle}`, {
                scroll: false,
              });
            }}
          >
            <Cross1Icon className="w-4 h-4 mr-1 text-gray-400" />
          </div>
        )}
      </form>
      <ToggleGroup
        type="single"
        className="flex items-center justify-center gap-3"
        variant="pill"
      >
        <ToggleGroupItem
          value=""
          aria-label="Toggle all"
          className={clsx(
            "opacity-60",
            "bg-transparent hover:bg-transparent hover:opacity-90 data-[state=on]:bg-transparent",
            !selectedStyle && "outline outline-1 opacity-100"
          )}
          onClick={() => {
            setSelectedStyle("");
            router.push(`/images?search=${text}&style=`, { scroll: false });
          }}
        >
          All
        </ToggleGroupItem>
        {styles.map(({ _id, style }) => (
          <ToggleGroupItem
            key={_id}
            value={style}
            aria-label={`Toggle ${style}`}
            className={clsx(
              "capitalize  opacity-60",
              "bg-transparent hover:bg-transparent hover:opacity-90 data-[state=on]:bg-transparent",
              selectedStyle === `${style}` && "outline outline-1 opacity-100"
            )}
            onClick={() => setSelectedStyle(style)}
          >
            {style}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </motion.div>
  );
}
