import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function PaymentCard({ userDetails }) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize --x and --y to the center of the Card
    if (targetRef.current) {
      targetRef.current.style.setProperty(
        "--x",
        `${targetRef.current.offsetWidth / 2 + 50}px`
      );
      targetRef.current.style.setProperty(
        "--y",
        `${targetRef.current.offsetHeight / 2 - 50}px`
      );
    }

    const updateMousePosition = (ev: MouseEvent) => {
      const { clientX, clientY } = ev;
      targetRef.current.style.setProperty("--x", `${clientX - 250}px`);
      targetRef.current.style.setProperty("--y", `${clientY - 300}px`);
    };

    targetRef.current.addEventListener("mousemove", updateMousePosition);

    return () => {
      if (targetRef.current) {
        targetRef.current.removeEventListener("mousemove", updateMousePosition);
      }
    };
  }, []);

  return (
    <div className="flex flex-col space-y-5 md:space-y-8 max-w-xs md:w-full md:max-w-xl h-full">
      <motion.div
        ref={targetRef}
        className="relative border dark:border-slate-700 border-opacity-10 text-white h-56 md:w-96 p-5 py-4 rounded-xl before:rounded-xl shadow-2xl before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[radial-gradient(circle_farthest-side_at_var(--x,0px)_var(--y,0px),gray_0%,_transparent_100%)] before:opacity-30 dark:before:opacity-20 bg-gradient-to-tl from-gray-900 to-gray-800 md:bg-transparent md:grainy-background"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="h-full flex flex-col justify-between">
          <div className="flex items-start justify-between space-x-4 mb-2">
            <div className="text-lg md:text-xl font-semibold italic">VISA</div>
          </div>

          <div className="inline-block w-8 h-6 md:w-12 md:h-8 bg-gradient-to-tl from-yellow-200 to-yellow-100 rounded-md shadow-inner overflow-hidden">
            <div className="relative w-full h-full grid grid-cols-2 gap-1">
              <div className="absolute border border-gray-900 rounded w-3 h-5 md:w-4 md:h-6 left-2.5 md:left-4 top-0.5 md:top-1"></div>
              <div className="border-b border-r border-gray-900 rounded-br"></div>
              <div className="border-b border-l border-gray-900 rounded-bl"></div>
              <div className=""></div>
              <div className=""></div>
              <div className="border-t border-r border-gray-900 rounded-tr"></div>
              <div className="border-t border-l border-gray-900 rounded-tl"></div>
            </div>
          </div>

          <div className="mt-5 md:mt-0">
            <div className="text-xs font-semibold tracking-tight">balance</div>

            <div className="text-xl font-semibold">
              {userDetails?.credits ?? 0} credits
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
