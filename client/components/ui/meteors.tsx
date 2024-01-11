import { cn } from "@/lib/utils";
import React from "react";

export const Meteors = ({
  number,
  mouseEnter = true,
  className,
}: {
  number?: number;
  mouseEnter?: boolean;
  className?: string;
}) => {
  const meteors = new Array(number || 20).fill(true);
  return (
    <>
      {meteors.map((el, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            mouseEnter ? "block" : "hidden",
            "animate-meteor-effect absolute top-1/2 right-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
            className
          )}
          style={{
            top: 0,
            right: Math.floor(Math.random() * (400 - -400) + -400) + "px",
            animationDelay: "0s",
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
          }}
        ></span>
      ))}
    </>
  );
};
