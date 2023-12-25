"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import * as z from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  MixerHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { useToast } from "./ui/use-toast";
import { Column } from "./ui/column";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Row } from "./ui/row";
import { Skeleton } from "./ui/skeleton";

import { Badge } from "./ui/badge";

import { Parameters } from "./parameters";
import {
  playgroundFormSchema,
  usePlaygroundForm,
} from "@/lib/hooks/use-playground-form";
import { featured } from "@/app/data/characters";

export const InputForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = usePlaygroundForm();

  const [open, setOpen] = useState(false);
  const [character, setCharacter] = useState(featured[0]);
  const [imageSrc, setImageSrc] = useState(featured[0].image1);

  // State management for Replicate prediction
  const [status, setStatus] = useState("Starting...");
  const [prediction, setPrediction] = useState(null);

  // Form states
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    setImageSrc(character.image1);
  }, [character]);

  async function onSubmit(values: z.infer<typeof playgroundFormSchema>) {
    // Submit the values to /generatePredictions
    console.log(values);

    setStatus("Starting...");
    setPrediction(null);
    setSubmitting(true);

    // Make initial request to Lambda function to create a prediction
    const res = await fetch("https://api.entropy.so/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
      }),
    });

    const response = await res.json();

    if (res.status !== 200 || response.status === "error") {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: response.message || "Unknown error",
      });
      setSubmitting(false);
      return;
    }

    // Extract the prediction ID from the returned URL for polling
    // When redirected to generation page, poll for progress
    const predictionId = response.url.split("/").pop();
    router.push(`/e/${predictionId}`);
  }

  return (
    <Column className="gap-8 w-full px-8 md:px-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CommandDialog
            open={open}
            onOpenChange={(newOpen) => {
              setOpen(newOpen);
              setCharacter(featured[0]);
            }}
          >
            <CommandInput placeholder="Type a command or search..." />
            <div className="grid grid-cols-[0.9fr_0fr_1fr] py-1 px-1">
              <CommandList>
                <CommandGroup heading="Featured">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <ToggleGroup
                    type="single"
                    value={character.name}
                    onValueChange={(value) => {
                      if (value) {
                        const selectedCharacter = featured.find(
                          (c) => c.name === value
                        );
                        form.setValue("lora", selectedCharacter.name);
                        setCharacter(selectedCharacter);
                      }
                    }}
                    className="flex flex-col gap-1"
                  >
                    {featured.map((c, index) => (
                      <ToggleGroupItem
                        key={index}
                        value={c.name}
                        className="h-full border border-slate-500 border-opacity-0 px-0 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 data-[state=on]:bg-accent data-[state=on]:border-opacity-20"
                      >
                        <CommandItem className="aria-selected:bg-transparent">
                          {c.name}
                        </CommandItem>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </CommandGroup>
              </CommandList>
              <Row className="my-auto mx-5 w-[1px] h-3/4 bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
              <div className="flex flex-col pl-4 pr-7 py-5 gap-6 pb-8">
                <Suspense fallback={<Skeleton className="w-full h-[380px]" />}>
                  <Image
                    width={800}
                    height={1200}
                    src={imageSrc.src}
                    alt={character.name}
                    className={`w-full h-[380px] object-cover ${imageSrc.imagePosition} rounded-lg shadow-lg`}
                    onMouseEnter={() => setImageSrc(character.image2)}
                    onMouseLeave={() => setImageSrc(character.image1)}
                  />
                </Suspense>
                <div className="flex flex-col gap-2">
                  {/* <div className="flex gap-1 justify-end">
                    {character.tags.map((tag, index) => {
                      return <Badge key={index}>{tag}</Badge>;
                    })}
                  </div> */}
                  {character.origin && (
                    <div className="flex gap-1 justify-end text-sm">
                      <span className="opacity-60">from</span>
                      <span className="font-medium">{character.origin}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full border-t flex justify-end p-1.5">
              <Button variant="ghost" className="items-center px-2">
                Select Character
                <kbd className="ml-2 py-1 px-1.5 bg-white border border-gray-200 font-mono text-xs text-gray-500 rounded-md dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
                  <ArrowLeftIcon />
                </kbd>
              </Button>
            </div>
          </CommandDialog>

          <div className="w-full justify-center flex flex-col">
            <FormField
              control={form.control}
              name="input_prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center gap-2">
                      <div className="w-full border rounded-lg shadow-lg py-2 pr-5 pl-2">
                        <div className="flex gap-5 h-full">
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
                                <Parameters form={form} />
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
