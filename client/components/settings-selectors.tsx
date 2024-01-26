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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface SettingsSelectorsProps {
  form: UseFormReturn<z.infer<typeof playgroundFormSchema>>;
}

export function SettingsSelectors({ form }: SettingsSelectorsProps) {
  const { value, handleSliderChange } = useSliderChange(
    form,
    "controlnetConditioning"
  );

  return (
    <div className="flex flex-col gap-6 items-center justify-between bg-slate-50 dark:bg-card bg-opacity-30 px-5 py-5 rounded-lg border border-slate-200 dark:border-accent border-opacity-50">
      <Label htmlFor="settings">Settings</Label>
      <div className="grid w-full h-full">
        <StepSelector form={form} />
        <Row className="my-6 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

        <CfgSelector form={form} />
        <Row className="my-6 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

        <StrengthSelector form={form} />
        <Row className="my-6 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

        <FormField
          control={form.control}
          name="sampler_name"
          render={({ field }) => (
            <div className="flex items-center justify-between space-x-8">
              <div className="flex items-center space-x-6">
                <Label htmlFor="version" className="font-normal">
                  Sampler
                </Label>
              </div>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="dpmpp_2m" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      DPM++ 2M Karras
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="euler_ancestral" />
                    </FormControl>
                    <FormLabel className="font-normal">Euler A</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </div>
          )}
        />
      </div>
    </div>
  );
}
