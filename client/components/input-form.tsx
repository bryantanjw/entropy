"use client";

import { useContext, useEffect, useRef, useState } from "react";
import * as z from "zod";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LockClosedIcon,
  MixerHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
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
import { SparklesCore } from "./ui/sparkles";
import { ScrollArea } from "./ui/scroll-area";
import { Icons } from "./ui/icons";
import { Separator } from "./ui/separator";
import { ImageCarousel } from "./image-carousel";
import { ShareFeedback } from "./share-feedback";
import { Parameters } from "./parameters";

import { playgroundFormSchema } from "@/lib/hooks/use-playground-form";
import { FormContext } from "@/lib/providers/form-provider";

export const InputForm = ({
  user,
  characters,
}: {
  user?: User;
  characters: any;
}) => {
  const router = useRouter();
  const form = useContext(FormContext);
  const { theme } = useTheme();

  const [popoverWidth, setPopoverWidth] = useState("0px");
  const [open, setOpen] = useState(false);
  const [character, setCharacter] = useState(characters[0]);
  const [images, setImages] = useState(characters[0].images);
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
    setImages(character.images);
  }, [character]);

  // Get the width of the parent div to set the width of the popover
  const parentDivRef = useRef(null);
  useEffect(() => {
    if (parentDivRef.current) {
      setPopoverWidth(`${parentDivRef.current.offsetWidth}px`);
    }
  }, [parentDivRef.current]);

  async function onSubmit(values: z.infer<typeof playgroundFormSchema>) {
    // Submit the values to /generatePredictions
    console.log(values);
    setSubmitting(true);

    // // Make initial request to Lambda function to create a prediction
    // const res = await fetch("https://api.entropy.so/predictions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     ...values,
    //     userId: user.id,
    //   }),
    // });

    // const response = await res.json();
    // console.log("response", response);

    // if (res.status !== 200 || response.status === "error") {
    //   toast.error("Uh oh! Something went wrong", {
    //     description: response.message || "Unknown error",
    //   });
    //   setSubmitting(false);
    //   return;
    // }

    // // Extract the prediction ID from the returned URL for polling
    // // When redirected to generation page, poll for progress
    // const predictionId = response.url.split("/").pop();
    // console.log("predictionId", predictionId);
    router.push(`/e/ipyqozbbmvsubyjbzlnzbefqi4`);
  }

  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if (e.key === "Enter") {
  //       e.preventDefault();
  //       form.setValue("lora", lastClickedCharacterRef.current.directory);
  //       setOpen(false);
  //     }
  //   };
  //   document.addEventListener("keydown", handleKeyDown);
  //   // Cleanup function to remove the event listener
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  const inputPromptRef = useRef(null);

  useEffect(() => {
    if (inputPromptRef.current) {
      inputPromptRef.current.textContent = form.watch("input_prompt");
    }
  }, [form.watch("input_prompt")]);

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, y: -50 }}
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
                <div className="grid grid-cols-[1.1fr_0.01fr_1fr] px-1 justify-items-center">
                  <CommandList className="w-full">
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
                    <ScrollArea className="h-[400px]">
                      <CommandGroup heading="Characters" className="mt-2">
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
                    </ScrollArea>
                  </CommandList>
                  <Row className="my-auto w-[1px] h-3/4 bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
                  <ImageCarousel images={images} character={character} />
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
                            <div
                              ref={parentDivRef}
                              className="flex gap-5 h-full items-center border rounded-lg shadow-lg"
                            >
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
                                ref={inputPromptRef}
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
                                onPaste={(e) => {
                                  e.preventDefault();
                                  const text =
                                    e.clipboardData.getData("text/plain");
                                  document.execCommand(
                                    "insertText",
                                    false,
                                    text
                                  );
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
                                  <PopoverContent
                                    alignOffset={-140}
                                    style={{ width: popoverWidth }}
                                  >
                                    <ScrollArea className="h-[700px] md:h-full">
                                      <Parameters form={form} />
                                    </ScrollArea>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <Button
                                onClick={async (event) => {
                                  event.preventDefault();
                                  if (!user) {
                                    toast.error(
                                      "You must be logged in to generate",
                                      {
                                        action: {
                                          label: "Log in",
                                          onClick: () => router.push("/signin"),
                                        },
                                      }
                                    );
                                  } else {
                                    const isValid = await form.trigger();
                                    const {
                                      formState: { errors },
                                    } = form;
                                    if (isValid) {
                                      onSubmit(form.getValues());
                                    } else {
                                      const inputPromptError =
                                        errors.input_prompt?.message;
                                      const loraError = errors.lora?.message;

                                      const errorMessage =
                                        inputPromptError ||
                                        loraError ||
                                        "Please select a character or type a prompt";

                                      toast.error(errorMessage);
                                    }
                                  }
                                }}
                                className="w-[120px] h-full rounded-l-none active:scale-95 scale-100 disabled:cursor-not-allowed transition width duration-200"
                              >
                                <div className="w-full absolute inset-0 h-full">
                                  <SparklesCore
                                    id="tsparticlesfullpage"
                                    background="transparent"
                                    minSize={0.6}
                                    maxSize={1.4}
                                    particleDensity={100}
                                    className="w-full h-full"
                                    particleColor={
                                      theme === "dark" ? "#000" : "#fff"
                                    }
                                  />
                                </div>
                                {isSubmitting ? (
                                  <Icons.spinner className="animate-spin" />
                                ) : (
                                  <div className="flex items-center justify-center gap-x-2">
                                    {user ? (
                                      <Image
                                        className="filter invert dark:filter-none"
                                        width={15}
                                        height={15}
                                        src={"/sparkling-icon.png"}
                                        alt={"Generate"}
                                      />
                                    ) : (
                                      <LockClosedIcon className="h-4 w-4" />
                                    )}
                                    <span>Generate</span>
                                  </div>
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
    </AnimatePresence>
  );
};

const json = {
  last_node_id: 47,
  last_link_id: 65,
  nodes: [
    {
      id: 2,
      type: "IPAdapterApply",
      pos: [940, -360],
      size: { "0": 315, "1": 258 },
      flags: {},
      order: 7,
      mode: 0,
      inputs: [
        { name: "ipadapter", type: "IPADAPTER", link: 2, slot_index: 0 },
        { name: "clip_vision", type: "CLIP_VISION", link: 3, slot_index: 1 },
        { name: "image", type: "IMAGE", link: 50 },
        { name: "model", type: "MODEL", link: 5, slot_index: 3 },
        { name: "attn_mask", type: "MASK", link: null },
      ],
      outputs: [
        { name: "MODEL", type: "MODEL", links: [6], shape: 3, slot_index: 0 },
      ],
      properties: { "Node name for S&R": "IPAdapterApply" },
      widgets_values: [1, 0, "original", 0, 0.5, false],
    },
    {
      id: 45,
      type: "LoadImage",
      pos: [90, 640],
      size: { "0": 315, "1": 314 },
      flags: {},
      order: 0,
      mode: 0,
      outputs: [
        {
          name: "IMAGE",
          type: "IMAGE",
          links: [61, 64],
          shape: 3,
          slot_index: 0,
        },
        { name: "MASK", type: "MASK", links: [], shape: 3, slot_index: 1 },
      ],
      properties: { "Node name for S&R": "LoadImage" },
      widgets_values: ["person1 (2).png", "image"],
    },
    {
      id: 4,
      type: "IPAdapterModelLoader",
      pos: [253, -767],
      size: { "0": 315, "1": 58 },
      flags: {},
      order: 1,
      mode: 0,
      outputs: [{ name: "IPADAPTER", type: "IPADAPTER", links: [2], shape: 3 }],
      properties: { "Node name for S&R": "IPAdapterModelLoader" },
      widgets_values: ["ip-adapter_sdxl_vit-h.safetensors"],
    },
    {
      id: 5,
      type: "CLIPVisionLoader",
      pos: [253, -642],
      size: { "0": 315, "1": 58 },
      flags: {},
      order: 2,
      mode: 0,
      outputs: [
        { name: "CLIP_VISION", type: "CLIP_VISION", links: [3], shape: 3 },
      ],
      properties: { "Node name for S&R": "CLIPVisionLoader" },
      widgets_values: ["SD1.5\\model.safetensors"],
    },
    {
      id: 1,
      type: "LoadImage",
      pos: [253, -324],
      size: { "0": 315, "1": 314 },
      flags: {},
      order: 3,
      mode: 0,
      outputs: [
        { name: "IMAGE", type: "IMAGE", links: [50], shape: 3, slot_index: 0 },
        { name: "MASK", type: "MASK", links: null, shape: 3 },
      ],
      properties: { "Node name for S&R": "LoadImage" },
      widgets_values: ["jacket.png", "image"],
    },
    {
      id: 6,
      type: "CheckpointLoaderSimple",
      pos: [253, -499],
      size: { "0": 315, "1": 98 },
      flags: {},
      order: 4,
      mode: 0,
      outputs: [
        { name: "MODEL", type: "MODEL", links: [5], shape: 3 },
        { name: "CLIP", type: "CLIP", links: [7, 9], shape: 3, slot_index: 1 },
        {
          name: "VAE",
          type: "VAE",
          links: [13, 42, 46],
          shape: 3,
          slot_index: 2,
        },
      ],
      properties: { "Node name for S&R": "CheckpointLoaderSimple" },
      widgets_values: ["sd_xl_base_1.0.safetensors"],
    },
    {
      id: 8,
      type: "CLIPTextEncode",
      pos: [940, -670],
      size: { "0": 366.4197082519531, "1": 81.32087707519531 },
      flags: {},
      order: 8,
      mode: 0,
      inputs: [{ name: "clip", type: "CLIP", link: 7 }],
      outputs: [
        {
          name: "CONDITIONING",
          type: "CONDITIONING",
          links: [8],
          shape: 3,
          slot_index: 0,
        },
      ],
      properties: { "Node name for S&R": "CLIPTextEncode" },
      widgets_values: [""],
    },
    {
      id: 7,
      type: "KSampler",
      pos: [1555, -495],
      size: { "0": 315, "1": 262 },
      flags: {},
      order: 15,
      mode: 0,
      inputs: [
        { name: "model", type: "MODEL", link: 6 },
        { name: "positive", type: "CONDITIONING", link: 8 },
        { name: "negative", type: "CONDITIONING", link: 10 },
        { name: "latent_image", type: "LATENT", link: 43, slot_index: 3 },
      ],
      outputs: [
        {
          name: "LATENT",
          type: "LATENT",
          links: [11],
          shape: 3,
          slot_index: 0,
        },
      ],
      properties: { "Node name for S&R": "KSampler" },
      widgets_values: [408867188596512, "fixed", 20, 8, "euler", "normal", 1],
    },
    {
      id: 9,
      type: "CLIPTextEncode",
      pos: [942, -513],
      size: { "0": 366.4197082519531, "1": 81.32087707519531 },
      flags: {},
      order: 9,
      mode: 0,
      inputs: [{ name: "clip", type: "CLIP", link: 9 }],
      outputs: [
        {
          name: "CONDITIONING",
          type: "CONDITIONING",
          links: [10],
          shape: 3,
          slot_index: 0,
        },
      ],
      properties: { "Node name for S&R": "CLIPTextEncode" },
      widgets_values: [""],
    },
    {
      id: 10,
      type: "VAEDecode",
      pos: [2030, -480],
      size: { "0": 210, "1": 46 },
      flags: {},
      order: 17,
      mode: 0,
      inputs: [
        { name: "samples", type: "LATENT", link: 11 },
        { name: "vae", type: "VAE", link: 13 },
      ],
      outputs: [
        { name: "IMAGE", type: "IMAGE", links: [65], shape: 3, slot_index: 0 },
      ],
      properties: { "Node name for S&R": "VAEDecode" },
    },
    {
      id: 47,
      type: "SaveImage",
      pos: [2324, -483],
      size: { "0": 461.55877685546875, "1": 479.5115661621094 },
      flags: {},
      order: 19,
      mode: 0,
      inputs: [{ name: "images", type: "IMAGE", link: 65 }],
      properties: {},
      widgets_values: ["ComfyUI"],
    },
    {
      id: 41,
      type: "GroundingDinoModelLoader (segment anything)",
      pos: [540, 860],
      size: { "0": 361.20001220703125, "1": 58 },
      flags: {},
      order: 5,
      mode: 0,
      outputs: [
        {
          name: "GROUNDING_DINO_MODEL",
          type: "GROUNDING_DINO_MODEL",
          links: [57],
          shape: 3,
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "GroundingDinoModelLoader (segment anything)",
      },
      widgets_values: ["GroundingDINO_SwinT_OGC (694MB)"],
    },
    {
      id: 40,
      type: "SAMModelLoader (segment anything)",
      pos: [540, 740],
      size: { "0": 351.3458251953125, "1": 63.54619598388672 },
      flags: {},
      order: 6,
      mode: 0,
      outputs: [
        {
          name: "SAM_MODEL",
          type: "SAM_MODEL",
          links: [56],
          shape: 3,
          slot_index: 0,
        },
      ],
      properties: { "Node name for S&R": "SAMModelLoader (segment anything)" },
      widgets_values: ["sam_vit_h (2.56GB)"],
    },
    {
      id: 44,
      type: "MaskToImage",
      pos: [2060, 770],
      size: { "0": 210, "1": 26 },
      flags: {},
      order: 12,
      mode: 0,
      inputs: [{ name: "mask", type: "MASK", link: 60 }],
      outputs: [
        { name: "IMAGE", type: "IMAGE", links: [62], shape: 3, slot_index: 0 },
      ],
      properties: { "Node name for S&R": "MaskToImage" },
    },
    {
      id: 46,
      type: "PreviewImage",
      pos: [2410, 770],
      size: { "0": 210, "1": 246 },
      flags: {},
      order: 14,
      mode: 0,
      inputs: [{ name: "images", type: "IMAGE", link: 62 }],
      properties: { "Node name for S&R": "PreviewImage" },
    },
    {
      id: 43,
      type: "GrowMask",
      pos: [1560, 770],
      size: { "0": 315, "1": 82 },
      flags: {},
      order: 11,
      mode: 0,
      inputs: [{ name: "mask", type: "MASK", link: 58 }],
      outputs: [
        {
          name: "MASK",
          type: "MASK",
          links: [60, 63],
          shape: 3,
          slot_index: 0,
        },
      ],
      properties: { "Node name for S&R": "GrowMask" },
      widgets_values: [5, true],
    },
    {
      id: 36,
      type: "VAEDecode",
      pos: [1950, 340],
      size: { "0": 210, "1": 46 },
      flags: {},
      order: 16,
      mode: 0,
      inputs: [
        { name: "samples", type: "LATENT", link: 44 },
        { name: "vae", type: "VAE", link: 46 },
      ],
      outputs: [
        { name: "IMAGE", type: "IMAGE", links: [45], shape: 3, slot_index: 0 },
      ],
      properties: { "Node name for S&R": "VAEDecode" },
    },
    {
      id: 37,
      type: "PreviewImage",
      pos: [2340, 340],
      size: { "0": 339.1112060546875, "1": 347.27813720703125 },
      flags: {},
      order: 18,
      mode: 0,
      inputs: [{ name: "images", type: "IMAGE", link: 45 }],
      properties: { "Node name for S&R": "PreviewImage" },
    },
    {
      id: 33,
      type: "VAEEncodeForInpaint",
      pos: [1103, 207],
      size: { "0": 315, "1": 98 },
      flags: {},
      order: 13,
      mode: 0,
      inputs: [
        { name: "pixels", type: "IMAGE", link: 64 },
        { name: "vae", type: "VAE", link: 42 },
        { name: "mask", type: "MASK", link: 63 },
      ],
      outputs: [
        {
          name: "LATENT",
          type: "LATENT",
          links: [43, 44],
          shape: 3,
          slot_index: 0,
        },
      ],
      properties: { "Node name for S&R": "VAEEncodeForInpaint" },
      widgets_values: [3],
    },
    {
      id: 42,
      type: "GroundingDinoSAMSegment (segment anything)",
      pos: [1080, 770],
      size: { "0": 352.79998779296875, "1": 122 },
      flags: {},
      order: 10,
      mode: 0,
      inputs: [
        { name: "sam_model", type: "SAM_MODEL", link: 56 },
        {
          name: "grounding_dino_model",
          type: "GROUNDING_DINO_MODEL",
          link: 57,
          slot_index: 1,
        },
        { name: "image", type: "IMAGE", link: 61, slot_index: 2 },
      ],
      outputs: [
        { name: "IMAGE", type: "IMAGE", links: [], shape: 3, slot_index: 0 },
        { name: "MASK", type: "MASK", links: [58], shape: 3, slot_index: 1 },
      ],
      properties: {
        "Node name for S&R": "GroundingDinoSAMSegment (segment anything)",
      },
      widgets_values: ["jacket", 0.4],
    },
  ],
  links: [
    [2, 4, 0, 2, 0, "IPADAPTER"],
    [3, 5, 0, 2, 1, "CLIP_VISION"],
    [5, 6, 0, 2, 3, "MODEL"],
    [6, 2, 0, 7, 0, "MODEL"],
    [7, 6, 1, 8, 0, "CLIP"],
    [8, 8, 0, 7, 1, "CONDITIONING"],
    [9, 6, 1, 9, 0, "CLIP"],
    [10, 9, 0, 7, 2, "CONDITIONING"],
    [11, 7, 0, 10, 0, "LATENT"],
    [13, 6, 2, 10, 1, "VAE"],
    [42, 6, 2, 33, 1, "VAE"],
    [43, 33, 0, 7, 3, "LATENT"],
    [44, 33, 0, 36, 0, "LATENT"],
    [45, 36, 0, 37, 0, "IMAGE"],
    [46, 6, 2, 36, 1, "VAE"],
    [50, 1, 0, 2, 2, "IMAGE"],
    [56, 40, 0, 42, 0, "SAM_MODEL"],
    [57, 41, 0, 42, 1, "GROUNDING_DINO_MODEL"],
    [58, 42, 1, 43, 0, "MASK"],
    [60, 43, 0, 44, 0, "MASK"],
    [61, 45, 0, 42, 2, "IMAGE"],
    [62, 44, 0, 46, 0, "IMAGE"],
    [63, 43, 0, 33, 2, "MASK"],
    [64, 45, 0, 33, 0, "IMAGE"],
    [65, 10, 0, 47, 0, "IMAGE"],
  ],
  groups: [],
  config: {},
  extra: {},
  version: 0.4,
  widget_idx_map: { "7": { seed: 0, sampler_name: 4, scheduler: 5 } },
};
