import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { z } from "zod";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Row } from "./ui/row";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { playgroundFormSchema } from "@/lib/hooks/use-playground-form";
import { SettingsSelectors } from "./settings-selectors";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { ModelSelector } from "./selectors/model-selector";
import { Textarea } from "./ui/textarea";
import Dropzone from "./ui/dropzone";

const dimensions = ["Portrait", "Square", "Landscape"];

interface ParametersProps {
  form: UseFormReturn<z.infer<typeof playgroundFormSchema>>;
}

export const Parameters: React.FC<ParametersProps> = ({ form }) => {
  const [size, setSize] = useState<"Portrait" | "Square" | "Landscape">(
    "Portrait"
  );

  const handleSizeChange = (value: "Portrait" | "Square" | "Landscape") => {
    if (value) {
      setSize(value);
      if (value === "Portrait") {
        form.setValue("height", 512);
        form.setValue("width", 340);
      } else if (value === "Square") {
        form.setValue("height", 340);
        form.setValue("width", 340);
      } else if (value === "Landscape") {
        form.setValue("height", 340);
        form.setValue("width", 512);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col h-full gap-6 items-center justify-between bg-slate-50 dark:bg-card bg-opacity-30 px-5 pt-5 py-6 rounded-lg border border-slate-200 dark:border-accent border-opacity-50">
          <Label htmlFor="image-size">Image Size</Label>
          <div className="relative flex flex-col items-center p-4">
            {/* Landscape */}
            <div className="relative border-2 border-dashed border-gray-200 dark:border-gray-600 p-4 w-36 h-24 flex items-center justify-center rounded-lg" />
            {/* Portrait */}
            <div
              className={`absolute border-2 ${
                size === "Portrait"
                  ? "w-24 h-36"
                  : size === "Square"
                  ? "w-32 h-32"
                  : "w-36 h-24"
              } border-gray-700 dark:border-gray-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-4 rounded-lg flex items-center justify-center transition-all duration-300`}
            >
              {size === "Portrait" && <span>2:3</span>}
              {size === "Square" && <span>1:1</span>}
              {size === "Landscape" && <span>3:2</span>}
            </div>
          </div>

          <Row className="my-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

          <div className="flex items-center justify-between space-x-6">
            <ToggleGroup
              key={"size"}
              type="single"
              className="flex items-center justify-center gap-3"
              variant="pill"
              value={size}
              onValueChange={handleSizeChange}
            >
              {dimensions.map((size) => (
                <ToggleGroupItem
                  key={size}
                  className={cn(
                    "data-[state=on]:bg-gray-800 data-[state=on]:text-white bg-slate-100 text-slate-500",
                    "dark:data-[state=on]:bg-slate-100 dark:hover:text-gray-50 dark:data-[state=on]:text-gray-800 dark:bg-transparent dark:text-opacity-70"
                  )}
                  value={size}
                  aria-label={`Toggle ${size}`}
                  size={"sm"}
                >
                  {size}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        <div className="flex flex-col gap-6 items-center justify-between bg-slate-50 dark:bg-card bg-opacity-30 px-5 py-5 rounded-lg border border-slate-200 dark:border-accent border-opacity-50">
          <FormField
            control={form.control}
            name="seed"
            render={({ field }) => (
              <FormControl>
                <div className="flex flex-col w-full gap-2">
                  <FormItem>
                    <HoverCard openDelay={200}>
                      <HoverCardTrigger asChild>
                        <Label
                          htmlFor="seed"
                          className="font-normal underline underline-offset-2 decoration-dotted decoration-slate-500"
                        >
                          Seed
                        </Label>
                      </HoverCardTrigger>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <HoverCardContent
                        side="left"
                        align="start"
                        className="w-[260px] text-sm"
                      >
                        Randomizer to generate a random image. Leave as 0 to
                        generate a random seed.
                      </HoverCardContent>
                    </HoverCard>
                  </FormItem>
                </div>
              </FormControl>
            )}
          />
        </div>
      </div>

      <SettingsSelectors form={form} />

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-6 items-center justify-between bg-slate-50 dark:bg-card bg-opacity-30 px-5 py-5 rounded-lg border border-slate-200 dark:border-accent border-opacity-50">
          <Label htmlFor="model">Aesthetics</Label>
          <div className="grid w-full">
            <div className="grid grid-cols-4 items-center space-x-8">
              <div className="items-center space-x-6">
                <Label htmlFor="version" className="font-normal">
                  Model
                </Label>
              </div>
              <ModelSelector form={form} />
            </div>

            <Row className="my-6 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

            <FormField
              control={form.control}
              name="negative_prompt"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center justify-between space-x-8">
                  <div className="flex items-center space-x-6">
                    <Label htmlFor="version" className="font-normal leading-4">
                      Negative prompt
                    </Label>
                  </div>
                  <FormControl>
                    <FormItem className="col-span-3 items-center space-x-3 space-y-0">
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
          </div>
        </div>
        <div className="flex h-full gap-6 items-center justify-between bg-slate-50 dark:bg-card bg-opacity-30 px-5 py-4 rounded-lg border border-slate-200 dark:border-accent border-opacity-50">
          <Dropzone form={form} />
        </div>
      </div>
    </div>
  );
};
