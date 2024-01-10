"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { MotionConfig, motion } from "framer-motion";

import { SparklesCore } from "@/components/ui/sparkles";
import { Row } from "@/components/ui/row";
import { ReloadIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";

export default function ImageOutput({ id }) {
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

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
  }, [id]);

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
      <motion.div
        className="mt-32"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        {predictions ? (
          <div className="grid grid-col-3 gap-5">
            {predictions.output.map((img, index) => (
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-portrait max-w-sm overflow-hidden rounded-md"
              >
                <Image
                  fill={true}
                  src={img}
                  className="object-cover"
                  alt={predictions.input_prompt}
                />
              </motion.figure>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="h-40 relative">
              <div className="flex items-center justify-center mb-2">
                <ReloadIcon className="animate-spin h-3 w-3 mr-2" />
                <span className="z-20 items-center italic">Loading</span>
              </div>
              {/* Gradients */}
              <Row className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={1200}
                className="w-full h-[78%]"
                particleColor={theme === "dark" ? "#fff" : "#000"}
              />
              {/* Radial Gradient to prevent sharp edges */}
              <div className="absolute inset-0 w-full h-full bg-white dark:bg-[#020817] [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
            </div>
          </div>
        )}
      </motion.div>
    </MotionConfig>
  );
}
