"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import { playgroundFormSchema } from "@/lib/hooks/use-playground-form";
import { checkpoints } from "@/lib/constants";

interface ModelSelectorProps {
  form: UseFormReturn<z.infer<typeof playgroundFormSchema>>;
}

export function ModelSelector({ form }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="checkpoint_model"
        render={({ field }) => (
          <FormItem className="col-span-3">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value?.split(".")[0] ?? "Select model"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" sideOffset={5}>
                <Command className="rounded-lg">
                  <CommandInput placeholder="Search model..." className="h-9" />
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <ScrollArea className="h-[200px] py-1">
                    {Object.keys(checkpoints).map((category) => (
                      <div key={category}>
                        <CommandGroup heading={category}>
                          {checkpoints[category].map((model) => (
                            <CommandItem
                              key={model}
                              value={model}
                              onSelect={() => {
                                form.setValue(
                                  "checkpoint_model",
                                  model + ".safetensors"
                                );
                                setOpen(false);
                              }}
                            >
                              {model}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  model === field.value?.split(".")[0]
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        <CommandSeparator />
                      </div>
                    ))}
                  </ScrollArea>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}
