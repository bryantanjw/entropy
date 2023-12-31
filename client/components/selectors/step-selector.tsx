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

interface StepSelectorProps {
  form: UseFormReturn<z.infer<typeof playgroundFormSchema>>;
}

export function StepSelector({ form }: StepSelectorProps) {
  const { value, handleSliderChange } = useSliderChange(form, "steps");

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <HoverCardTrigger asChild>
              <Label
                htmlFor="steps"
                className="font-normal underline underline-offset-2 decoration-dotted decoration-slate-500"
              >
                Inference Step
              </Label>
            </HoverCardTrigger>
            <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
              {value}
            </span>
          </div>
          <Slider
            id="steps"
            max={100}
            min={1}
            value={[value]}
            step={1}
            onValueChange={handleSliderChange}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            aria-label="Inference Step"
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
