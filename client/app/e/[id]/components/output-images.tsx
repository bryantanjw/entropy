"use client";

import clsx from "clsx";
import { useState, useEffect } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

import { notFound, usePathname } from "next/navigation";
import Link from "next/link";
import OutputImage from "./image";
import { Progress } from "@/components/ui/progress";
import { extractProgress } from "@/lib/helpers";
import Image from "next/image";

import { loadingImages } from "@/lib/constants";

export default function OutputImages({ id }) {
  const pathname = usePathname();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageData, setImageData] = useState(loadingImages[currentImageIndex]);
  const [imageLoading, setImageLoading] = useState(true);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Randomize the initial image
    const randomIndex = Math.floor(Math.random() * loadingImages.length);
    setCurrentImageIndex(randomIndex);
    setImageData(loadingImages[randomIndex]);

    // Set interval to cycle images every 8 seconds
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % loadingImages.length;
        setImageData(loadingImages[nextIndex]);
        return nextIndex;
      });
    }, 12000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const [predictions, setPredictions] = useState(() => {
    if (typeof window !== "undefined") {
      const storedPredictions = localStorage.getItem(`predictions-${id}`);
      return storedPredictions ? JSON.parse(storedPredictions) : null;
    }
    return null;
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function pollAPI() {
      while (!predictions && id && !isCancelled) {
        try {
          // Check if we have predictions in localStorage first
          const storedPredictions = localStorage.getItem(`predictions-${id}`);
          if (storedPredictions) {
            setPredictions(JSON.parse(storedPredictions));
            return;
          }

          let pollRes = await fetch(`https://api.entropy.so/predictions/${id}`);
          let pollResponse = await pollRes.json();
          const { status, logs } = pollResponse;

          const newProgress = extractProgress(logs);
          if (newProgress !== null) {
            setProgress(newProgress);
          }

          if (pollResponse.status === "succeeded") {
            if (!isCancelled) {
              setPredictions(pollResponse);
              localStorage.setItem(
                `predictions-${id}`,
                JSON.stringify(pollResponse)
              );
            }
          } else if (pollResponse.status === "failed") {
            throw new Error("Prediction failed");
          } else {
            // Delay to make requests to API Gateway every 3 seconds
            await new Promise((resolve) => setTimeout(resolve, 6000));
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
  }, [id]); // Removed predictions from the dependency array

  if (error || !id) {
    return notFound();
  }

  return (
    <AnimatePresence mode="wait">
      <MotionConfig
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          y: { type: "spring", stiffness: 300, damping: 30 },
        }}
      >
        {predictions ? (
          <div className="h-full pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-10 mt-32">
            {predictions.output.map((img, index) => {
              const path = img.split("/").slice(-2, -1)[0];
              return (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  key={index}
                >
                  <Link key={index} href={`${pathname}/${path}${index}`}>
                    <OutputImage path={path} index={index} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center gap-8 w-full px-12 md:px-32 mt-32"
          >
            <Progress className="h-1.5" value={progress} />
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row"
            >
              <Image
                loading="eager"
                alt={`${imageData.character} - Generated by Entropy`}
                src={imageData.imageUrl}
                width={400}
                height={500}
                className={clsx(
                  "object-cover",
                  imageLoading
                    ? "scale-120 blur-3xl grayscale"
                    : "scale-100 blur-0 grayscale-0"
                )}
                onLoad={() => setImageLoading(false)}
              />
              <div className="bg-muted flex flex-col items-start justify-start h-full p-11 pb-16 gap-10">
                <div className="flex flex-col gap-2">
                  <h4 className="text-muted-foreground font-semibold">Tip</h4>
                  <h4 className="text-muted-foreground">{imageData.tip}</h4>
                </div>
                <div className="inline-flex text-2xl">
                  <span>&quot;</span>
                  <h2 className="">{imageData.input_prompt}&quot;</h2>
                </div>
                <div className="mt-auto">
                  <h4 className="text-muted-foreground italic tracking-wide">
                    {imageData.character}
                  </h4>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </MotionConfig>
    </AnimatePresence>
  );
}
