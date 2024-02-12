"use client";

import clsx from "clsx";
import { useState, useEffect } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

import { notFound, usePathname } from "next/navigation";
import Link from "next/link";
import OutputImage from "./output-image";
import { Progress } from "@/components/ui/progress";
import { extractProgress } from "@/lib/helpers";
import Image from "next/image";

import { loadingImages } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export default function OutputImages({ id }) {
  const pathname = usePathname();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageData, setImageData] = useState(loadingImages[currentImageIndex]);
  const [imageLoading, setImageLoading] = useState(true);

  const [progress, setProgress] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);

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

          const { progress: newProgress, cycle } = extractProgress(logs);
          if (newProgress !== null && cycle !== null) {
            setProgress(newProgress);
            // Assuming there's a state to hold the current cycle
            setCurrentCycle(cycle);
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
  }, [id]);

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
          <>
            <div className="flex md:hidden w-full mt-20 items-center gap-3 text-xs font-semibold px-8 md:px-0">
              <p className="opacity-40">RESULTS</p>
              <Separator className="h-[1.5px] w-[80%] md:w-[90%]" />
            </div>
            <div className="md:pb-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 md:px-0 mt-10 md:mt-24">
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
                      <OutputImage
                        path={path}
                        index={index}
                        predictionId={id}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center gap-8 w-full px-8 md:px-32 mt-12 md:mt-20"
          >
            <p className="text-center text-muted-foreground -mb-4">
              {progress <= 0 ? "Booting..." : `Generating ${currentCycle}/3...`}
            </p>
            <Progress className="h-1.5" value={progress} />
            <p className="text-center -mt-4 text-xs text-muted-foreground">
              Takes about 45s to generate
            </p>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="grid grid-row-2 md:grid-cols-5"
            >
              <Image
                loading="eager"
                alt={`${imageData.character} - Generated by Entropy`}
                src={imageData.imageUrl}
                width={400}
                height={500}
                className={clsx(
                  "md:col-span-2 object-cover object-top h-[360px] md:h-full",
                  imageLoading
                    ? "scale-120 blur-3xl grayscale"
                    : "scale-100 blur-0 grayscale-0"
                )}
                onLoad={() => setImageLoading(false)}
              />
              <div className="md:col-span-3 bg-muted flex flex-col items-start justify-start h-full pt-8 p-6 md:p-11 md:pb-16 gap-6 md:gap-10">
                <div className="flex flex-col gap-2 text-sm md:text-md">
                  <h4 className="text-muted-foreground font-semibold">Tip</h4>
                  <h4 className="text-muted-foreground">{imageData.tip}</h4>
                </div>
                <div className="inline-flex md:text-xl">
                  <span>&quot;</span>
                  <h2 className="">{imageData.input_prompt}&quot;</h2>
                </div>
                <div className="mt-auto">
                  <h4 className="text-sm md:text-md text-muted-foreground italic tracking-wide">
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
