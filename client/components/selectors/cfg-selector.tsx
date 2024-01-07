"use client";

import * as React from "react";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { playgroundFormSchema } from "@/lib/hooks/use-playground-form";
import { useSliderChange } from "@/lib/hooks/use-slider-change";

interface CfgSelectorProps {
  form: UseFormReturn<z.infer<typeof playgroundFormSchema>>;
}

export function CfgSelector({ form }: CfgSelectorProps) {
  const { value, handleSliderChange } = useSliderChange(form, "cfg");

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <HoverCardTrigger asChild>
              <Label
                htmlFor="cfg"
                className="font-normal underline underline-offset-2 decoration-dotted decoration-slate-500"
              >
                CFG
              </Label>
            </HoverCardTrigger>
            <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
              {value}
            </span>
          </div>
          <Slider
            id="cfg"
            max={30.0}
            min={1.0}
            value={[value]}
            step={0.5}
            onValueChange={handleSliderChange}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            aria-label="CFG"
          />
        </div>
        <HoverCardContent
          side="left"
          align="start"
          className="w-[260px] text-sm"
        >
          Number of denoising steps (minimum: 1; maximum: 100).
          <br /> <br /> Decrease to have the initial composition follows the QR
          code more. You will only see the QR code if you reduce it too much.
          The range of steps varies by model.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
