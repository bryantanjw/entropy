"use client";

import Link from "next/link";
import clsx from "clsx";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
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
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

import { ImageDataType } from "@/sanity/types/ImageDataType";
import { Badge, badgeVariants } from "./ui/badge";

type ImageItemProps = {
  index: number;
  total: number;
  image: ImageDataType;
  images: Array<ImageDataType>;
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
const cardVariants = {
  enter: () => {
    return {
      x: 1000,
      opacity: 0,
    };
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: () => {
    return {
      x: -1000,
      opacity: 0,
    };
  },
};

const Field: React.FC<FieldProps> = ({ id, label, value }) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label
        htmlFor={id}
        className="font-mono text-slate-600 dark:text-slate-200"
      >
        {label}
      </Label>
      <Input
        disabled
        id={id}
        className="focus-visible:ring-0 bg-slate-50 dark:bg-slate-100 disabled:opacity-100 disabled:cursor-text shadow-none border-0 text-muted-foreground dark:text-muted"
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
  const [isLoading, setIsLoading] = useState(true);
  const [currIndex, setCurrIndex] = useState(index);
  const [direction, setDirection] = useState(0);

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

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <Dialog
        onOpenChange={(open) => {
          if (open) {
            setCurrIndex(index);
          }
        }}
      >
        <motion.figure
          className={clsx(
            "group relative mb-4 overflow-hidden rounded-md bg-neutral-two dark:bg-neutral-nine",
            "md:mb-4",
            "lg:mb-8",
            image.ratio === "square"
              ? "aspect-square"
              : image.ratio === "landscape"
              ? "aspect-landscape"
              : "aspect-portrait"
          )}
          key={image._id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <DialogTrigger>
            <Image
              fill={true}
              loading={image.ratio === "portrait" ? "eager" : "lazy"}
              priority={image.ratio === "portrait" ? true : false}
              sizes="(min-width: 66em) 33vw, (min-width: 44em) 50vw, 100vw"
              alt={image.title}
              src={image.image_url}
              className={clsx(
                "object-cover duration-700 ease-in-out group-hover:cursor-pointer group-hover:opacity-90",
                isLoading
                  ? "scale-120 blur-3xl grayscale"
                  : "scale-100 blur-0 grayscale-0"
              )}
              onLoad={() => setIsLoading(false)}
            />
          </DialogTrigger>
        </motion.figure>

        <AnimatePresence initial={false} custom={direction}>
          <DialogContent
            showCloseIcon={false}
            className={clsx(
              "grid-cols-[1fr_500px] gap-12 items-center justify-center max-w-6xl border-0"
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
                images[currIndex].ratio === "square"
                  ? "aspect-square"
                  : images[currIndex].ratio === "landscape"
                  ? "aspect-landscape"
                  : "aspect-portrait"
              )}
            >
              <Image
                width={1080}
                height={720}
                loading={
                  images[currIndex].ratio === "portrait" ? "eager" : "lazy"
                }
                priority={images[currIndex].ratio === "portrait" ? true : false}
                sizes="(min-width: 66em) 33vw, (min-width: 44em) 50vw, 100vw"
                alt={images[currIndex].title}
                src={images[currIndex].image_url}
                className={clsx(
                  "object-cover duration-700 ease-in-out h-full",
                  isLoading
                    ? "scale-120 blur-3xl grayscale"
                    : "scale-100 blur-0 grayscale-0"
                )}
                onLoad={() => setIsLoading(false)}
                quality={100}
              />
            </motion.figure>
            <motion.div
              key={`${currIndex}-card`}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col h-full rounded-lg p-2 py-5 justify-between border bg-card text-card-foreground shadow-xl"
            >
              <div className="space-y-4">
                <CardHeader>
                  <CardTitle className="mb-2">Imagine</CardTitle>
                  <CardDescription className="flex flex-col text-sm gap-2">
                    <Link
                      href={"/"}
                      className={clsx(
                        badgeVariants({ variant: "default" }),
                        "w-fit py-1 opacity-90 items-center"
                      )}
                    >
                      <PersonIcon className="mr-2 h-3 w-3" />
                      {images[currIndex].title}
                    </Link>

                    {images[currIndex].prompt.length > 500
                      ? `${images[currIndex].prompt.substring(0, 500)}...`
                      : images[currIndex].prompt}
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
                        className="h-[80px] resize-none focus-visible:ring-0 bg-slate-50 dark:bg-slate-100 disabled:opacity-100 disabled:cursor-text shadow-none border-0 text-muted-foreground dark:text-muted overflow-auto scrollbar-hide"
                        value={images[currIndex].negative_prompt}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Field
                        id="style"
                        label="style"
                        value={images[currIndex].style}
                      />
                      <Field
                        id="model"
                        label="model"
                        value={images[currIndex].model}
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Field
                        id="cfg_scale"
                        label="cfg_scale"
                        value={images[currIndex].cfg_scale}
                      />
                    </div>
                    <Field
                      id="steps"
                      label="steps"
                      value={images[currIndex].steps}
                    />
                    <Field
                      id="sampler"
                      label="sampler"
                      value={images[currIndex].sampler}
                    />
                    <Field
                      id="seed"
                      label="seed"
                      value={images[currIndex].seed}
                    />
                  </div>
                </CardContent>
              </div>

              <CardFooter className="flex flex-col gap-2">
                <div className="flex w-full gap-1">
                  <Button
                    variant={"secondary"}
                    className="w-full rounded-r-none"
                    size={"lg"}
                  >
                    <PersonIcon className="mr-2 h-4 w-4" />
                    Use Character
                  </Button>
                  <Button
                    variant={"secondary"}
                    className="w-full rounded-l-none"
                    size={"lg"}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Use Style
                  </Button>
                </div>
                <Button className="w-full h-11" size={"lg"}>
                  <MagicWandIcon className="mr-2 h-4 w-4" /> Use All
                </Button>
              </CardFooter>

              <DialogClose className="absolute right-4 top-4">
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
