"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import * as z from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  MixerHorizontalIcon,
  PlusIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
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

import { Parameters } from "./parameters";
import {
  playgroundFormSchema,
  usePlaygroundForm,
} from "@/lib/hooks/use-playground-form";
import { featured } from "@/app/data/characters";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { SparklesCore } from "./ui/sparkles";

export const InputForm = () => {
  const router = useRouter();
  const form = usePlaygroundForm();

  const [open, setOpen] = useState(false);
  const [character, setCharacter] = useState(featured[0]);
  const [imageSrc, setImageSrc] = useState(featured[0].image1);
  // Create a ref to store the last clicked character
  const lastClickedCharacterRef = useRef(null);

  // Form states
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
    console.log("response", response);

    if (res.status !== 200 || response.status === "error") {
      toast.error("Uh oh! Something went wrong", {
        description: response.message || "Unknown error",
      });
      setSubmitting(false);
      return;
    }

    // Extract the prediction ID from the returned URL for polling
    // When redirected to generation page, poll for progress
    const predictionId = response.url.split("/").pop();
    console.log("predictionId", predictionId);
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
            className="md:min-w-[900px]"
          >
            <CommandInput placeholder="Type a command or search..." />
            <div className="grid grid-cols-[1.4fr_0fr_1fr] py-1 px-1">
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
                        setCharacter(selectedCharacter);
                      }
                    }}
                    className="flex flex-col gap-1"
                  >
                    {featured.map((c, index) => (
                      <ToggleGroupItem
                        key={index}
                        value={c.name}
                        onClick={() => {
                          if (lastClickedCharacterRef.current === c) {
                            // Update the form value if the same character is clicked twice
                            form.setValue("lora", c.dir);
                            setOpen(false);
                            lastClickedCharacterRef.current = null; // Reset the ref
                          } else {
                            // Store the last clicked character in the ref
                            lastClickedCharacterRef.current = c;
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            lastClickedCharacterRef.current === c
                          ) {
                            // Update the form value if Enter is pressed and it's the last clicked character
                            form.setValue("lora", c.dir);
                            setOpen(false);
                            lastClickedCharacterRef.current = null; // Reset the ref
                          }
                        }}
                        className="flex justify-between h-full border border-slate-500 border-opacity-0 px-0 items-center rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 data-[state=on]:bg-accent data-[state=on]:border-opacity-20"
                      >
                        <CommandItem className="aria-selected:bg-transparent">
                          {c.name}
                        </CommandItem>

                        {c.origin && (
                          <span className="font-light text-xs opacity-40 pr-2">
                            {c.origin}
                          </span>
                        )}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </CommandGroup>
              </CommandList>
              <Row className="my-auto mx-5 w-[1px] h-3/4 bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
              <div className="flex flex-col gap-6 pb-5">
                <Suspense fallback={<Skeleton className="w-full h-[380px]" />}>
                  <CardContainer className="inter-var">
                    <CardItem translateZ="100" className="mt-4 relative">
                      <Image
                        width={720}
                        height={1080}
                        src={imageSrc.src}
                        alt={character.name}
                        className={`w-[300px] h-[400px] object-cover ${imageSrc.imagePosition} rounded-lg shadow-lg`}
                      />
                    </CardItem>
                  </CardContainer>
                </Suspense>
                <div className="flex flex-col gap-2"></div>
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

          <motion.div
            className="w-full justify-center flex flex-col"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <FormField
              control={form.control}
              name="input_prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center gap-2">
                      <div className="w-full rounded-lg shadow-lg dark:border">
                        <div className="flex gap-5 h-full items-center">
                          <Button
                            variant={
                              form.watch("lora") ? "outline" : "secondary"
                            }
                            onClick={(event) => {
                              setOpen(true);
                              event.preventDefault();
                            }}
                            className="m-2 item-start"
                          >
                            {form
                              .watch("lora")
                              ?.split("/")[1]
                              ?.split(".")[0]
                              .replace(/_/g, " ") ?? (
                              <>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Character
                              </>
                            )}
                          </Button>
                          <div
                            role="textbox"
                            contentEditable
                            data-placeholder="Imagine..."
                            className="flex-1 my-2 border-0 shadow-none bg-transparent outline-none"
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
                            onInput={(e) => {
                              form.setValue(
                                "input_prompt",
                                e.currentTarget.textContent
                              );
                            }}
                            {...field}
                          />
                          <div className="justify-end items-center">
                            <Popover>
                              <PopoverTrigger
                                asChild
                                className="opacity-60 hover:opacity-100 data-[state=open]:opacity-100"
                              >
                                <Button
                                  variant="ghost"
                                  className="p-0 hover:bg-transparent transition duration-200"
                                >
                                  <MixerHorizontalIcon className="h-4 w-4 mr-1" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[30rem] lg:w-[48rem] xl:w-[64rem]">
                                <Parameters form={form} />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <Button
                            onClick={async (event) => {
                              event.preventDefault();
                              onSubmit(form.getValues());
                            }}
                            className="w-[120px] h-full rounded-l-none active:scale-95 scale-100 disabled:cursor-not-allowed transition width duration-200"
                          >
                            <div className="w-full absolute inset-0 h-full">
                              <SparklesCore
                                id="tsparticlesfullpage"
                                background="transparent"
                                minSize={0.6}
                                maxSize={1.4}
                                particleDensity={200}
                                className="w-full h-full"
                                particleColor="#FFFFFF"
                              />
                            </div>
                            {isSubmitting ? (
                              <ReloadIcon className="animate-spin" />
                            ) : (
                              <>
                                <Image
                                  className="filter invert dark:filter-none mr-2"
                                  width={15}
                                  height={15}
                                  src={"/sparkling-icon.png"}
                                  alt={"Generate"}
                                />
                                Generate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>
        </form>
      </Form>
    </Column>
  );
};
