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

export const Edits = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      toast.info("Please select a file to upload.");
      return;
    }

    setUploading(true);

    const response = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL + "/api/upload",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      }
    );

    if (response.ok) {
      const { url, fields } = await response.json();

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);

      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        toast("Upload successful!");
      } else {
        console.error("S3 Upload Error:", uploadResponse);
        toast.error("Upload failed.");
      }
    } else {
      toast.error("Failed to get pre-signed URL.");
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
            <Button disabled={uploading} onClick={handleSubmit}>
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
              >
                <StarIcon className="w-4 h-4 mr-4" /> Save as favorite
              </Button>
              <Button
                variant="ghost"
                className="py-5 px-3 justify-start items-center"
              >
                <DownloadIcon className="w-4 h-4 mr-3" /> Download
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
