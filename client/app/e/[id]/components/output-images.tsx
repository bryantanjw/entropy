"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MotionConfig, motion } from "framer-motion";

import { SparklesCore } from "@/components/ui/sparkles";
import { notFound, usePathname } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import OutputImage from "./image";

export default function OutputImages({ id }) {
  const { theme } = useTheme();
  const pathname = usePathname();

  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function pollAPI() {
      while (!predictions && id && !isCancelled) {
        try {
          let pollRes = await fetch(
            `https://api.entropy.so/predictions/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + process.env.REPLICATE_API_KEY,
              },
            }
          );
          let pollResponse = await pollRes.json();

          if (pollResponse.status === "succeeded") {
            if (!isCancelled) {
              setPredictions(pollResponse);
            }
          } else if (pollResponse.status === "failed") {
            throw new Error("Prediction failed");
          } else {
            // Delay to make requests to API Gateway every 3 seconds
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        } catch (error) {
          if (!isCancelled) {
            setError(error.message);
          }
          break;
        }
      }
    }

    pollAPI();

    return () => {
      isCancelled = true;
    };
  }, [id, predictions]);

  if (error || !id) {
    return notFound();
  }

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      {predictions ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {predictions.output.map((img, index) => {
            const path = img.split("/").slice(-2, -1)[0];
            return (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                key={index}
              >
                <Link
                  key={index}
                  href={`${pathname}/${path}${index}`}
                  className="rounded-md hover:scale-95 transition-all duration-200"
                >
                  <OutputImage path={path} index={index} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col -mt-24">
          <div className="h-40 relative">
            {/* Gradients */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-[78%]"
              particleColor={theme === "dark" ? "#fff" : "#000"}
            />
            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
            <div className="flex items-center justify-center mt-10">
              <Icons.spinner className="animate-spin h-3 w-3 mr-2" />
              <span className="z-20 items-center italic">Loading</span>
            </div>
          </div>
        </div>
      )}
    </MotionConfig>
  );
}
