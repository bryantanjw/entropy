import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

import { StepSelector } from "./selectors/step-selector";
import { Label } from "./ui/label";
import { Row } from "./ui/row";
import { Slider } from "./ui/slider";

import { useSliderChange } from "@/lib/hooks/use-slider-change";
import { playgroundFormSchema } from "@/lib/hooks/use-playground-form";
import { CfgSelector } from "./selectors/cfg-selector";
import { StrengthSelector } from "./selectors/strength-selector";

interface SettingsSelectorsProps {
  form: UseFormReturn<z.infer<typeof playgroundFormSchema>>;
}

export function SettingsSelectors({ form }: SettingsSelectorsProps) {
  const { value, handleSliderChange } = useSliderChange(
    form,
    "controlnetConditioning"
  );

  return (
    <div className="flex flex-col gap-6 items-center justify-between bg-slate-50 dark:bg-slate-900 bg-opacity-30 px-5 pt-5 py-6 rounded-lg border border-slate-200 dark:border-slate-800 border-opacity-50">
      <Label htmlFor="settings">Settings</Label>
      <div className="grid w-full h-full">
        <StepSelector form={form} />
        <Row className="my-6 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
        <CfgSelector form={form} />
        <Row className="my-6 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
        <StrengthSelector form={form} />
      </div>
    </div>
  );
}
