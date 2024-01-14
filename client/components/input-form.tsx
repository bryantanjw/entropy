"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import * as z from "zod";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MixerHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Row } from "./ui/row";
import { Skeleton } from "./ui/skeleton";
import { CardContainer, CardItem } from "./ui/3d-card";
import { SparklesCore } from "./ui/sparkles";
import { ScrollArea } from "./ui/scroll-area";
import { Icons } from "./ui/icons";

import { Parameters } from "./parameters";
import { Separator } from "./ui/separator";
import { ShareFeedback } from "./share-feedback";

import {
  playgroundFormSchema,
  usePlaygroundForm,
} from "@/lib/hooks/use-playground-form";

export const InputForm = ({
  user,
  characters,
}: {
  user?: User;
  characters: any;
}) => {
  const router = useRouter();
  const form = usePlaygroundForm();
  const { theme } = useTheme();

  const [open, setOpen] = useState(false);
  const [character, setCharacter] = useState(characters[0]);
  const [imageSrc, setImageSrc] = useState(characters[0].images[0]);
  // Create a ref to store the last clicked character
  const lastClickedCharacterRef = useRef(null);

  const [feedbackOpen, setFeedbackOpen] = useState(false);

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
    setImageSrc(character.images[0]);
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
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div className="gap-8 w-full px-8 md:px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CommandDialog
              open={open}
              onOpenChange={(newOpen) => {
                setOpen(newOpen);
              }}
              className="md:min-w-[900px]"
            >
              <CommandInput placeholder="Search..." />
              <div className="grid grid-cols-[1.4fr_0fr_1fr] py-1 px-1 mt-2">
                <CommandList>
                  <CommandEmpty className="flex flex-col py-6 items-center gap-5">
                    <span> No results found. </span>
                    <Button
                      onClick={(e) => {
                        if (user) {
                          e.preventDefault();
                          setFeedbackOpen(true);
                        } else {
                          toast.error(
                            "You must be logged in to request a character",
                            {
                              action: {
                                label: "Log in",
                                onClick: () => router.push("/signin"),
                              },
                            }
                          );
                        }
                      }}
                    >
                      Request Character
                    </Button>
                    <ShareFeedback
                      email={user?.email}
                      open={feedbackOpen}
                      setOpen={setFeedbackOpen}
                    />
                  </CommandEmpty>
                  <CommandGroup heading="Characters">
                    {characters.map((c, index) => (
                      <CommandItem
                        key={index}
                        value={c.name}
                        onSelect={() => {
                          setCharacter(c);
                          if (lastClickedCharacterRef.current === c) {
                            // Update the form value if the same character is clicked twice
                            form.setValue("lora", c.directory);
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
                            form.setValue("lora", c.directory);
                            setOpen(false);
                            lastClickedCharacterRef.current = null; // Reset the ref
                          }
                        }}
                        className={cn(
                          "h-full px-0 items-center justify-between border border-slate-500 border-opacity-0 rounded-md data-[state=on]:bg-accent aria-selected:bg-slate-50 data-[state=on]:border-opacity-20",
                          {
                            "border-opacity-40 bg-slate-100":
                              lastClickedCharacterRef.current === c ||
                              character === c,
                          }
                        )}
                      >
                        <span>{c.name}</span>

                        {c.origin && (
                          <span className="font-light text-xs opacity-40 pr-2">
                            {c.origin}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <Row className="my-auto mx-5 w-[1px] h-3/4 bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
                <div className="flex flex-col gap-6 pb-5">
                  <Suspense
                    fallback={<Skeleton className="w-full h-[380px]" />}
                  >
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
              <div className="w-full border-t flex justify-end p-1.5 items-center">
                <Button
                  variant="ghost"
                  className="items-center px-2.5"
                  onClick={() => {
                    form.setValue(
                      "lora",
                      lastClickedCharacterRef.current.directory
                    );
                    setOpen(false);
                  }}
                >
                  Select Character
                  <kbd className="ml-2 py-1 px-1.5 border font-mono text-xs rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-corner-down-left w-4 h-4"
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#2c3e50"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M18 6v6a3 3 0 0 1 -3 3h-10l4 -4m0 8l-4 -4" />
                    </svg>
                  </kbd>
                </Button>
                <Separator
                  orientation="vertical"
                  className="h-[40%] mx-3 w-[2px]"
                />
                <Button
                  variant="ghost"
                  className="items-center px-2.5 opacity-60 mr-3"
                  onClick={(e) => {
                    if (user) {
                      e.preventDefault();
                      setFeedbackOpen(true);
                    } else {
                      toast.error(
                        "You must be logged in to request a character",
                        {
                          action: {
                            label: "Log in",
                            onClick: () => router.push("/signin"),
                          },
                        }
                      );
                    }
                  }}
                >
                  Request
                </Button>
                <ShareFeedback
                  email={user?.email}
                  open={feedbackOpen}
                  setOpen={setFeedbackOpen}
                />
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
                        <div className="w-full rounded-lg">
                          <div className="flex gap-5 h-full items-center border rounded-lg shadow-lg">
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
                                if (
                                  e.key === "Backspace" ||
                                  e.key === "Delete"
                                ) {
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
                                    className="p-2 hover:bg-transparent transition duration-200"
                                  >
                                    <MixerHorizontalIcon className="h-4 w-4 mr-1" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="min-w-[28rem] md:min-w-[44rem] lg:w-[60rem] xl:w-[64rem]">
                                  <ScrollArea className="h-[700px] md:h-full">
                                    <Parameters form={form} />
                                  </ScrollArea>
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
                                  particleDensity={120}
                                  className="w-full h-full"
                                  particleColor={
                                    theme === "dark" ? "#000" : "#fff"
                                  }
                                />
                              </div>
                              {isSubmitting ? (
                                <Icons.spinner className="animate-spin" />
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
            </div>
          </form>
        </Form>
      </div>

      <Row className="my-24 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
    </motion.div>
  );
};
