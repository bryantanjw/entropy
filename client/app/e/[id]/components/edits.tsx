"use client";

import { useState } from "react";
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

export const Edits = ({ userId, path, index }) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (userId) => {
    setUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: `https://replicate.delivery/pbxt/${path}/out-${index}.png`,
          userId: userId,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast("Upload successful!");
      } else {
        console.error("Upload Error:", responseData);
        toast.error("Upload failed.");
      }
    } catch (error) {
      console.error("Request Error:", error);
      toast.error("Upload failed.");
    }

    setUploading(false);
  };

  return (
    <div className="flex w-full justify-between">
      <Button
        variant="ghost"
        className="group items-center"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all" />
        Back
      </Button>
      <div className="flex items-center space-x-3">
        <Button variant="secondary">Upscale</Button>
        <Button variant="secondary">Edit</Button>
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
                onClick={() => handleUpload(userId)}
              >
                {uploading ? (
                  <Icons.spinner className="w-4 h-4 mr-3 animate-spin" />
                ) : (
                  <StarIcon className="w-4 h-4 mr-4" />
                )}
                Save as favorite
              </Button>
              <Button
                variant="ghost"
                className="py-5 px-3 justify-start items-center"
              >
                <DownloadIcon className="w-4 h-4 mr-3" />
                Download
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
