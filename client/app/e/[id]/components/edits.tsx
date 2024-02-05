"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  DownloadIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "@/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Edits = ({ user, predictionId, path, index }) => {
  const { id, email } = user;
  const router = useRouter();
  const [predictions, setPredictions] = useState(() => {
    if (typeof window !== "undefined") {
      const storedPredictions = localStorage.getItem(
        `predictions-${predictionId}`
      );
      return storedPredictions ? JSON.parse(storedPredictions) : null;
    }
    return null;
  });
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function getPrediction() {
      if (predictions) {
        // If predictions are already loaded, no need to fetch them again
        return;
      }

      try {
        const response = await fetch(
          `https://api.entropy.so/predictions/${predictionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
            },
          }
        );
        const prediction = await response.json();

        if (prediction.status === "succeeded") {
          console.log("edits", prediction);
          setPredictions(prediction);
          // Store the predictions in localStorage
          localStorage.setItem(
            `predictions-${predictionId}`,
            JSON.stringify(prediction)
          );
        } else if (prediction.status === "failed") {
          throw new Error("Prediction failed");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load prediction.");
      }
    }

    getPrediction();
  }, [predictionId]);

  const handleUpload = async () => {
    setUploading(true);
    console.log(predictions);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: `https://replicate.delivery/pbxt/${path}/out-${index}.png`,
          userId: id,
          predictionInput: predictions.input,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Saved to favourites!", {
          action: {
            label: "View",
            onClick: () => router.push("/profile"),
          },
        });
      } else {
        console.error("Upload Error:", responseData);
        toast.error("Saving failed.");
      }
    } catch (error) {
      console.error("Request Error:", error);
      toast.error("Saving failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    const imageUrl = `https://replicate.delivery/pbxt/${path}/out-${index}.png`;

    fetch(imageUrl, {
      headers: new Headers({
        Origin: location.origin,
      }),
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `entropy-${index}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Download failed:", error);
        toast.error("Download failed.");
      })
      .finally(() => {
        setDownloading(false);
      });
  };

  return (
    <div className="flex flex-col md:flex-row w-full gap-10 md:justify-between">
      <Button
        variant="ghost"
        className="group justify-start items-center"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all" />
        Back
      </Button>
      <div className="flex justify-end items-center space-x-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="secondary" disabled>
                Upscale
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Coming soon!</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="secondary" disabled>
                Animate
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Coming soon!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              Save <ChevronDownIcon className="w-4 h-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={10}
            className="w-80 p-2 shadow-lg rounded-lg"
          >
            <div className="grid gap-2">
              <Button
                variant="ghost"
                className="py-5 px-3 items-center justify-start"
                disabled={uploading}
                onClick={handleUpload}
              >
                {uploading ? (
                  <Icons.spinner className="w-4 h-4 mr-3 animate-spin" />
                ) : (
                  <StarIcon className="w-4 h-4 mr-4" />
                )}
                Save to favorites
              </Button>
              <Button
                variant="ghost"
                className="w-full py-5 px-3 justify-start items-center"
                onClick={handleDownload}
              >
                {downloading ? (
                  <Icons.spinner className="w-4 h-4 mr-3 animate-spin" />
                ) : (
                  <DownloadIcon className="w-4 h-4 mr-3" />
                )}
                Download
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
