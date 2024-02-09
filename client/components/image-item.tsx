"use client";

import Link from "next/link";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useTransform,
  useScroll,
} from "framer-motion";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
  DownloadIcon,
  ImageIcon,
  MagicWandIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { Dialog, DialogTrigger, DialogContent, DialogClose } from "./ui/dialog";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Icons } from "./ui/icons";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { badgeVariants } from "./ui/badge";
import { CardContainer, CardItem } from "./ui/3d-card";
import { ScrollArea } from "./ui/scroll-area";

import { ImageDataType } from "@/sanity/types/ImageDataType";
import { FormContext } from "@/lib/providers/form-provider";
import { handleDownload } from "@/lib/helpers";

type ImageItemProps = {
  index: number;
  total: number;
  image: ImageDataType;
  images: Array<ImageDataType>;
  gridRef?: React.RefObject<HTMLDivElement>;
};

type FieldProps = {
  id: string;
  label: string;
  value: string | number;
  disabled?: boolean;
};

const imageVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const Field: React.FC<FieldProps> = ({ id, label, value }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <Label
        htmlFor={id}
        className="font-mono text-slate-600 dark:text-slate-200"
      >
        {label}
      </Label>
      <Input
        disabled
        id={id}
        className="focus-visible:ring-0 bg-muted disabled:opacity-100 disabled:cursor-text shadow-none border-0 text-foreground"
        value={value}
      />
    </div>
  );
};

export default function ImageItem({
  image,
  index,
  total,
  images,
}: ImageItemProps) {
  const form = useContext(FormContext);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currIndex, setCurrIndex] = useState(index);
  const [direction, setDirection] = useState(0);
  const [isDownloading, setDownloading] = useState(false);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const match = window.matchMedia("(min-width: 768px)").matches;
    setIsDesktop(match);
  }, []);
  const column = isDesktop ? (index % 3) + 1 : 1;

  const toggleDialog = () => setDialogOpen(!isDialogOpen);

  const currentImage: ImageDataType =
    images[currIndex] || ({} as ImageDataType);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"], // remove this if container is not fixed height
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateY =
    column === 1 || column === 3 ? translateFirst : translateSecond;

  useEffect(() => {
    setCurrIndex(0);
  }, [images]);

  useEffect(() => {
    const handleRightArrow = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setDirection(1);
        setCurrIndex((currIndex + 1 + total) % total);
      }
    };

    const handleLeftArrow = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setDirection(-1);
        setCurrIndex((currIndex - 1 + total) % total);
      }
    };

    window.addEventListener("keydown", handleRightArrow);
    window.addEventListener("keydown", handleLeftArrow);

    // Cleanup function to remove the event listeners when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleRightArrow);
      window.removeEventListener("keydown", handleLeftArrow);
    };
  }, [currIndex, total]);

  const handleUseCharacter = () => {
    form.setValue("lora", currentImage.lora_dir);

    setDialogOpen(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300); // Sometimes, trying to scroll while a modal or dialog is closing, the animation can interfere with the scroll
  };

  const handleUseStyle = () => {
    form.setValue("checkpoint_model", currentImage.model + ".safetensors");
    form.setValue("negative_prompt", currentImage.negative_prompt);
    form.setValue("steps", currentImage.steps);
    form.setValue("sampler_name", currentImage.sampler);
    form.setValue("seed", currentImage.seed);
    form.setValue("cfg", currentImage.cfg_scale);

    setDialogOpen(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const handleTweak = () => {
    form.setValue("input_prompt", currentImage.prompt);
    handleUseCharacter();
    handleUseStyle();
  };

  if (isDesktop) {
    return (
      <MotionConfig
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          y: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
      >
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (open) {
              setCurrIndex(index);
            }
          }}
        >
          <CardContainer>
            <CardItem translateZ="100">
              <motion.figure
                className={clsx(
                  "group relative overflow-hidden rounded-md bg-neutral-two dark:bg-neutral-nine",
                  image.ratio === "square"
                    ? "aspect-square"
                    : image.ratio === "landscape"
                    ? "aspect-landscape"
                    : "aspect-portrait"
                )}
                style={{ y: translateY }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DialogTrigger onClick={toggleDialog}>
                  <Image
                    fill={true}
                    loading={image.ratio === "portrait" ? "eager" : "lazy"}
                    priority={image.ratio === "portrait" ? true : false}
                    sizes="(min-width: 66em) 33vw, (min-width: 44em) 50vw, 100vw"
                    alt={image.title}
                    src={image.image_url}
                    className={clsx(
                      "object-cover duration-200 ease-in-out group-hover:cursor-pointer",
                      isLoading
                        ? "scale-120 blur-3xl grayscale"
                        : "scale-100 blur-0 grayscale-0"
                    )}
                    onLoad={() => setIsLoading(false)}
                  />
                </DialogTrigger>
              </motion.figure>
            </CardItem>
          </CardContainer>

          <AnimatePresence initial={false} custom={direction}>
            <DialogContent
              onEscapeKeyDown={toggleDialog}
              showCloseIcon={false}
              className={clsx(
                "md:grid-cols-[1fr_500px] px-4 md:px-0 gap-12 items-center justify-center max-w-6xl border-0"
              )}
            >
              <Button
                variant={"ghost"}
                size={"icon"}
                className="fixed -left-[100px] hover:bg-transparent focus-visible:ring-0"
                onClick={() => {
                  setDirection(-1);
                  setCurrIndex((currIndex - 1 + total) % total);
                }}
              >
                <ChevronLeftIcon className="h-12 w-12 opacity-50 hover:opacity-90 transition duration-200" />
              </Button>
              <motion.figure
                key={`${currIndex}-image`}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className={clsx(
                  "group relative max-w-2xl overflow-hidden rounded-md shadow-xl bg-neutral-two dark:bg-neutral-nine",
                  currentImage?.ratio === "square"
                    ? "aspect-square"
                    : currentImage.ratio === "landscape"
                    ? "aspect-landscape"
                    : "aspect-portrait"
                )}
              >
                <Image
                  width={1536}
                  height={1032}
                  loading={currentImage.ratio === "portrait" ? "eager" : "lazy"}
                  priority={currentImage.ratio === "portrait" ? true : false}
                  sizes="(min-width: 66em) 33vw, (min-width: 44em) 50vw, 100vw"
                  alt={currentImage.title}
                  src={currentImage.image_url}
                  className={clsx(
                    "object-cover duration-700 ease-in-out h-full",
                    isLoading
                      ? "scale-120 blur-3xl grayscale"
                      : "scale-100 blur-0 grayscale-0"
                  )}
                  onLoad={() => setIsLoading(false)}
                  quality={100}
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-4 top-4 rounded-lg"
                  onClick={() =>
                    handleDownload({
                      imageUrl: currentImage.image_url,
                      setDownloading,
                    })
                  }
                >
                  {isDownloading ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    <DownloadIcon className="h-4 w-4" />
                  )}
                </Button>
              </motion.figure>
              <motion.div
                key={`${currIndex}-card`}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="hidden md:flex flex-col h-full rounded-lg p-2 py-5 justify-between border bg-card text-card-foreground shadow-xl"
              >
                <div className="space-y-4">
                  <CardHeader>
                    <CardTitle className="mb-2">Imagine</CardTitle>
                    <CardDescription className="flex flex-col text-sm gap-2 text-foreground">
                      <Link
                        href={`/images?search=${currentImage.title}`}
                        className={clsx(
                          badgeVariants({ variant: "default" }),
                          "w-fit py-1 opacity-90 items-center"
                        )}
                      >
                        <PersonIcon className="mr-2 h-3 w-3" />
                        {currentImage.title}
                      </Link>
                      <ScrollArea className="h-20">
                        {currentImage.prompt?.length > 500
                          ? `${currentImage.prompt.substring(0, 500)}...`
                          : currentImage.prompt}
                      </ScrollArea>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label
                          htmlFor="negative_prompt"
                          className="font-mono text-slate-600 dark:text-slate-200"
                        >
                          negative_prompt
                        </Label>
                        <Textarea
                          disabled
                          id="negative_prompt"
                          className="h-[60px] resize-none focus-visible:ring-0 bg-muted disabled:opacity-100 disabled:cursor-text shadow-none border-0 text-foreground overflow-auto scrollbar-hide"
                          value={currentImage.negative_prompt}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Field
                          id="style"
                          label="style"
                          value={currentImage.style}
                        />
                        <Field
                          id="model"
                          label="model"
                          value={currentImage.model}
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Field
                          id="cfg_scale"
                          label="cfg_scale"
                          value={currentImage.cfg_scale}
                        />
                      </div>
                      <Field
                        id="steps"
                        label="steps"
                        value={currentImage.steps}
                      />
                      <Field
                        id="sampler"
                        label="sampler"
                        value={currentImage.sampler}
                      />
                      <Field id="seed" label="seed" value={currentImage.seed} />
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="flex flex-col gap-2">
                  <div className="flex w-full gap-1">
                    <Button
                      variant={"secondary"}
                      className="w-full rounded-r-none"
                      size={"lg"}
                      onClick={handleUseCharacter}
                    >
                      <PersonIcon className="mr-2 h-4 w-4" />
                      Use Character
                    </Button>
                    <Button
                      variant={"secondary"}
                      className="w-full rounded-l-none"
                      size={"lg"}
                      onClick={handleUseStyle}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Use Style
                    </Button>
                  </div>
                  <Button
                    className="w-full h-11"
                    size={"lg"}
                    onClick={handleTweak}
                  >
                    <MagicWandIcon className="mr-2 h-4 w-4" /> Tweak it
                  </Button>
                </CardFooter>

                <DialogClose
                  onClick={toggleDialog}
                  className="absolute right-4 top-4"
                >
                  <Cross2Icon className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </motion.div>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="fixed -right-[100px] hover:bg-transparent focus-visible:ring-0"
                onClick={() => {
                  setDirection(1);
                  setCurrIndex((currIndex + 1 + total) % total);
                }}
              >
                <ChevronRightIcon className="h-12 w-12 opacity-50 hover:opacity-90 transition duration-200" />
              </Button>
            </DialogContent>
          </AnimatePresence>
        </Dialog>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <Drawer
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            setCurrIndex(index);
          }
        }}
      >
        <motion.figure
          className={clsx(
            "group relative overflow-hidden rounded-md bg-neutral-two dark:bg-neutral-nine",
            image.ratio === "square"
              ? "aspect-square"
              : image.ratio === "landscape"
              ? "aspect-landscape"
              : "aspect-portrait"
          )}
          style={{ y: translateY }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <DrawerTrigger onClick={toggleDialog}>
            <Image
              fill={true}
              loading={image.ratio === "portrait" ? "eager" : "lazy"}
              priority={image.ratio === "portrait" ? true : false}
              sizes="(min-width: 66em) 33vw, (min-width: 44em) 50vw, 100vw"
              alt={image.title}
              src={image.image_url}
              className={clsx(
                "object-cover duration-200 ease-in-out group-hover:cursor-pointer",
                isLoading
                  ? "scale-120 blur-3xl grayscale"
                  : "scale-100 blur-0 grayscale-0"
              )}
              onLoad={() => setIsLoading(false)}
            />
          </DrawerTrigger>
        </motion.figure>

        <AnimatePresence initial={false} custom={direction}>
          <DrawerContent onEscapeKeyDown={toggleDialog}>
            <ScrollArea className="h-[400px] py-3">
              <motion.div className="flex flex-col h-full rounded-lg justify-between bg-card text-card-foreground shadow-xl">
                <div className="space-y-4">
                  <CardHeader>
                    <CardTitle className="mb-2">Imagine</CardTitle>
                    <CardDescription className="flex flex-col text-sm gap-2 text-foreground">
                      <Link
                        href={`/images?search=${currentImage.title}`}
                        className={clsx(
                          badgeVariants({ variant: "default" }),
                          "w-fit py-1 opacity-90 items-center"
                        )}
                      >
                        <PersonIcon className="mr-2 h-3 w-3" />
                        {currentImage.title}
                      </Link>
                      <ScrollArea className="h-20">
                        {currentImage.prompt?.length > 500
                          ? `${currentImage.prompt.substring(0, 500)}...`
                          : currentImage.prompt}
                      </ScrollArea>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label
                          htmlFor="negative_prompt"
                          className="font-mono text-slate-600 dark:text-slate-200"
                        >
                          negative_prompt
                        </Label>
                        <Textarea
                          disabled
                          id="negative_prompt"
                          className="h-[60px] resize-none focus-visible:ring-0 bg-muted disabled:opacity-100 disabled:cursor-text shadow-none border-0 text-foreground overflow-auto scrollbar-hide"
                          value={currentImage.negative_prompt}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Field
                          id="style"
                          label="style"
                          value={currentImage.style}
                        />
                        <Field
                          id="model"
                          label="model"
                          value={currentImage.model}
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Field
                          id="cfg_scale"
                          label="cfg_scale"
                          value={currentImage.cfg_scale}
                        />
                      </div>
                      <Field
                        id="steps"
                        label="steps"
                        value={currentImage.steps}
                      />
                      <Field
                        id="sampler"
                        label="sampler"
                        value={currentImage.sampler}
                      />
                      <Field id="seed" label="seed" value={currentImage.seed} />
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="flex flex-col gap-2">
                  <div className="flex w-full gap-1">
                    <Button
                      variant={"secondary"}
                      className="w-full rounded-r-none"
                      size={"lg"}
                      onClick={handleUseCharacter}
                    >
                      <PersonIcon className="mr-2 h-4 w-4" />
                      Use Character
                    </Button>
                    <Button
                      variant={"secondary"}
                      className="w-full rounded-l-none"
                      size={"lg"}
                      onClick={handleUseStyle}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Use Style
                    </Button>
                  </div>
                  <Button
                    className="w-full h-11"
                    size={"lg"}
                    onClick={handleTweak}
                  >
                    <MagicWandIcon className="mr-2 h-4 w-4" /> Tweak it
                  </Button>
                </CardFooter>
              </motion.div>
            </ScrollArea>
          </DrawerContent>
        </AnimatePresence>
      </Drawer>
    </MotionConfig>
  );
}
