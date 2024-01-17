"use client";

import {
  ArrowLeftIcon,
  ChevronDownIcon,
  DownloadIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const Edits = () => {
  const router = useRouter();

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
