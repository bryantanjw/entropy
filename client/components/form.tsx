"use client";

import { useEffect, useRef, useState } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { MixerHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";
import { Column } from "./ui/column";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Parameters } from "./parameters";
import {
  playgroundFormSchema,
  usePlaygroundForm,
} from "@/lib/hooks/use-playground-form";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const InputForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = usePlaygroundForm();
  const [open, setOpen] = useState(false);

  // Form states
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const inputDivRef = useRef<HTMLDivElement>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputDivRef.current && popoverContentRef.current) {
      popoverContentRef.current.style.width = `${inputDivRef.current.offsetWidth}px`;
    }
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function onSubmit(values: z.infer<typeof playgroundFormSchema>) {
    // Do something with the form values.
    router.push(`e/${1}`);
    console.log(values);
  }

  return (
    <Column className="gap-8 w-full px-8 md:px-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Featured">
                <CommandItem>Calendar</CommandItem>
                <CommandItem>Search Emoji</CommandItem>
                <CommandItem>Calculator</CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>

          <div className="w-full justify-center flex flex-col">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center gap-2">
                      <div className="w-full border rounded-lg shadow-lg py-2 pr-5 pl-2">
                        <div className="flex gap-5 h-full" ref={inputDivRef}>
                          <Button
                            variant={"secondary"}
                            onClick={(event) => {
                              setOpen(true);
                              event.preventDefault();
                            }}
                          >
                            <PlusIcon className="mr-2 h-4 w-4" /> Character
                          </Button>
                          <div
                            role="textbox"
                            contentEditable
                            data-placeholder="Imagine..."
                            className="flex-1 my-auto border-0 shadow-none bg-transparent outline-none"
                            onKeyDown={(e) => {
                              if (e.key === "Backspace" || e.key === "Delete") {
                                if (
                                  e.currentTarget.textContent &&
                                  e.currentTarget.textContent.length === 1
                                ) {
                                  e.preventDefault();
                                  e.currentTarget.textContent = "";
                                }
                              }
                            }}
                            {...field}
                          />
                          <div className="justify-end items-center">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="p-0 hover:bg-transparent hover:opacity-100 transition duration-200 opacity-70"
                                >
                                  <MixerHorizontalIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[30rem] lg:w-[48rem] xl:w-[64rem]">
                                <Parameters />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={async (event) => {
                          event.preventDefault();
                          onSubmit(form.getValues());
                        }}
                        className="w-[20%] h-full py-4 lg:w-auto active:scale-95 scale-100 disabled:cursor-not-allowed transition duration-200 shadow-lg"
                      >
                        <Image
                          className="filter invert dark:filter-none mr-2"
                          width={17}
                          height={17}
                          src={"/sparkling-icon.png"}
                          alt={"Generate"}
                        />
                        Generate
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </Column>
  );
};
