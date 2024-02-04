import React from "react";
import { cn } from "@/lib/utils";
import { Illustration } from "@/components/ui/glowing-stars";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CreditsGrid = () => {
  const [mouseEnter, setMouseEnter] = React.useState(false);
  return (
    <div
      className={cn(
        "lg:col-span-2",
        "row-span-1 flex flex-col rounded-lg group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-md px-3 pt-5 dark:bg-black dark:border-white/[0.1] bg-white border space-y-2"
      )}
      onMouseEnter={() => {
        setMouseEnter(true);
      }}
      onMouseLeave={() => {
        setMouseEnter(false);
      }}
    >
      <Illustration mouseEnter={mouseEnter} />
      <div className="flex p-1.5 px-4 pt-3">
        <span className="font-semibold leading-none tracking-wide">
          On-Demand Credits
        </span>
      </div>
      <div className="p-1.5 pt-0 text-sm font-light px-4 space-y-4">
        <p className="opacity-70">
          You cannot buy on-demand credits without an active subscription.
        </p>
        <Select>
          <SelectTrigger id="credits">
            <SelectValue placeholder="Select credits" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="50">30 Credits</SelectItem>
            <SelectItem value="100">80 Credits</SelectItem>
            <SelectItem value="200">200 Credits</SelectItem>
          </SelectContent>
        </Select>

        <div className="mt-6 p-4 rounded-lg border bg-muted opacity-60">
          <div className="font-medium">Credits Balance Summary</div>
          <div className="mt-3">
            <div className="flex justify-between">
              <span>Current Credits Balance</span>
              <div>200</div>
            </div>
          </div>
          <Separator className="my-2.5" />
          <div>
            <div className="flex justify-between">
              <span>On-Demand Credits</span>
            </div>
          </div>
          <Separator className="my-2.5" />

          <div>
            <div className="flex justify-between">
              <span>New Credits Balance After Purchase</span>
              <div>200</div>
            </div>
          </div>
        </div>
      </div>

      <CardFooter className="px-4">
        <Button className="w-full">Purchase Credits</Button>
      </CardFooter>
    </div>
  );
};
