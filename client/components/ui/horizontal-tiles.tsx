// @ts-nocheck

"use client";

import * as THREE from "three";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import isEqual from "lodash/isEqual";
import {
  Image as ImageDrei,
  ScrollControls,
  Scroll,
  useScroll,
  Html,
} from "@react-three/drei";
import { proxy, useSnapshot } from "valtio";
import { easing } from "maath";
import { motion } from "framer-motion";

import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Cross2Icon,
  ExternalLinkIcon,
  Pencil1Icon,
  PersonIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const material = new THREE.LineBasicMaterial({ color: "white" });
const geometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, -0.5, 0),
  new THREE.Vector3(0, 0.5, 0),
]);
const state = proxy({
  clicked: null,
  images: [],
});

function Minimap() {
  const ref = useRef();
  const scroll = useScroll();
  const { images } = useSnapshot(state);
  const { height } = useThree((state) => state.viewport);
  useFrame((state, delta) => {
    ref.current.children.forEach((child, index) => {
      // Give me a value between 0 and 1
      //   starting at the position of my item
      //   ranging across 4 / total length
      //   make it a sine, so the value goes from 0 to 1 to 0.
      const y = scroll.curve(
        index / images.length - 1.5 / images.length,
        4 / images.length
      );
      easing.damp(child.scale, "y", 0.15 + y / 6, 0.15, delta);
    });
  });
  return (
    <group ref={ref}>
      {images.map((_, i) => (
        <line
          key={i}
          geometry={geometry}
          material={material}
          position={[i * 0.06 - images.length * 0.03, -height / 2 + 0.6, 0]}
        />
      ))}
    </group>
  );
}

function Item({ index, position, scale, c = new THREE.Color(), ...props }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleDialog = () => setDialogOpen(!isDialogOpen);

  const ref = useRef();
  const scroll = useScroll();
  const { clicked, images } = useSnapshot(state);
  const [hovered, hover] = useState(false);

  // Add a useEffect hook to handle the dialog closing
  useEffect(() => {
    if (!isDialogOpen && state.clicked === index) {
      state.clicked = null; // Unexpand the image when the dialog closes
    }
  }, [isDialogOpen, index]);

  const click = () => {
    if (state.clicked === index) {
      toggleDialog(); // Open the dialog without un-expanding the image
    } else {
      state.clicked = index; // Expand the image if it's not already expanded
    }
  };
  const over = () => hover(true);
  const out = () => hover(false);
  useFrame((state, delta) => {
    const y = scroll.curve(
      index / images.length - 1.5 / images.length,
      4 / images.length
    );
    const defaultHeight = 3.5 + y; // Default height when not clicked
    const increasedDefaultHeight = defaultHeight + 1; // Increase the default height by 1
    const expandedHeight = 5.5; // New height for the expanded image, increased from 5 to 6

    easing.damp3(
      ref.current.scale,
      [
        clicked === index ? 4 : scale[0],
        clicked === index ? expandedHeight : increasedDefaultHeight,
        1,
      ],
      0.15,
      delta
    );

    ref.current.material.scale[0] = ref.current.scale.x;
    ref.current.material.scale[1] = ref.current.scale.y;
    if (clicked !== null && index < clicked)
      easing.damp(ref.current.position, "x", position[0] - 1.65, 0.15, delta);
    if (clicked !== null && index > clicked)
      easing.damp(ref.current.position, "x", position[0] + 1.65, 0.15, delta);
    if (clicked === null || clicked === index)
      easing.damp(ref.current.position, "x", position[0], 0.15, delta);
    easing.damp(
      ref.current.material,
      "grayscale",
      hovered || clicked === index ? 0 : Math.max(0, 1 - y),
      0.15,
      delta
    );
    easing.dampC(
      ref.current.material.color,
      hovered || clicked === index ? "white" : "#aaa",
      hovered ? 0.3 : 0.15,
      delta
    );
  });
  return (
    <>
      <ImageDrei
        ref={ref}
        {...props}
        position={position}
        scale={scale}
        onClick={click}
        onPointerOver={over}
        onPointerOut={out}
        alt={"Entropy image"}
      />

      <Html>
        <ImageDialog
          {...props}
          isDialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
      </Html>
    </>
  );
}

function Items({ w = 0.7, gap = 0.15, images, ...props }) {
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;
  return (
    <ScrollControls
      horizontal
      damping={0.1}
      pages={(width - xW + images.length * xW) / width}
    >
      <Minimap />
      <Scroll>
        {images.map((image, i) => (
          <Item
            key={i}
            index={i}
            position={[i * xW, 0.2, 0]}
            scale={[w, 4, 1]}
            url={image.url}
            metadata={image.metadata}
            userId={props.userId}
            removeImageFromState={props.removeImageFromState}
          />
        ))}
      </Scroll>
    </ScrollControls>
  );
}

export default function HorizontalTiles({
  images,
  userId,
  removeImageFromState,
}) {
  useEffect(() => {
    if (!isEqual(state.images, images)) {
      state.images.length = 0; // Clear existing images
      images.forEach((image) => {
        state.images.push(image); // Push new images into the state proxy
      });
    }
  }, [images]);

  return (
    <Canvas
      gl={{ antialias: false }}
      dpr={[1, 1.5]}
      onPointerMissed={() => (state.clicked = null)}
    >
      <Items
        images={state.images}
        userId={userId}
        removeImageFromState={removeImageFromState}
      />
    </Canvas>
  );
}

function ImageDialog({
  isDialogOpen,
  setDialogOpen,
  setIsLoading,
  isLoading,
  ...props
}) {
  const { url, userId, metadata, removeImageFromState } = props;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const handleDeleteImage = async (url) => {
    setIsDeleting(true);
    const imageKey = extractS3KeyFromUrl(url);

    try {
      const response = await fetch("/api/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          imageKey: imageKey,
        }),
      });

      if (response.ok) {
        if (response.status !== 204) {
          const responseData = await response.json();
        }
        removeImageFromState(url);
        console.log("Image deleted successfully");
        toast.success("Image deleted");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete image:", errorData.error);
        toast.error("Failed to delete image. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image. Please try again later.");
    } finally {
      setIsDeleting(false);
      setAlertOpen(false);
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        showCloseIcon={false}
        className={clsx(
          "grid-cols-2 gap-12 items-center justify-center max-w-5xl border-0"
        )}
      >
        <motion.figure
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          exit={{ opacity: 0, y: -50 }}
          className={clsx(
            "group relative max-w-2xl overflow-hidden rounded-md shadow-xl bg-neutral-two dark:bg-neutral-nine"
          )}
        >
          <Image
            width={1080}
            height={720}
            alt={"entropy"}
            src={url}
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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          exit={{ opacity: 0, y: 50 }}
          className="flex flex-col h-full rounded-lg p-2 py-0 justify-between border bg-card text-card-foreground shadow-xl"
        >
          <div className="flex flex-col justify-between h-full space-y-4">
            <CardHeader className="pb-0">
              <CardTitle className="mb-2">Imagine</CardTitle>
              <CardDescription className="flex flex-col text-sm gap-2 text-foreground">
                <Badge
                  className={clsx(
                    badgeVariants({ variant: "default" }),
                    "w-fit py-1 opacity-90 items-center"
                  )}
                >
                  <PersonIcon className="mr-2 h-3 w-3" />
                  {metadata.lora
                    ? metadata.lora
                        .split("/")
                        .pop()
                        .replace(/_/g, " ")
                        .replace(".safetensors", "")
                    : "Character"}
                </Badge>
                <ScrollArea className="h-20">
                  {metadata.input_prompt}
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
                    value={metadata.negative_prompt}
                  />
                </div>

                <div className="flex gap-3">
                  <Field
                    id="model"
                    label="model"
                    value={metadata.checkpoint_model.replace(
                      ".safetensors",
                      ""
                    )}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Field
                    id="cfg_scale"
                    label="cfg_scale"
                    value={metadata.cfg}
                  />
                </div>
                <Field id="steps" label="steps" value={metadata.steps} />
                <Field
                  id="sampler"
                  label="sampler"
                  value={metadata.sampler_name}
                />
                <Field id="seed" label="seed" value={metadata.seed} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row gap-2">
              <AlertDialog open={isAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={"secondary"}
                    className="w-full h-11 text-red-500"
                    size={"lg"}
                    onClick={() => setAlertOpen(true)}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your image from your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setAlertOpen(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="text-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteImage(url);
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Icons.spinner className="w-4 h-4 mr-3 animate-spin" />
                          Deleting
                        </>
                      ) : (
                        "Delete image"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button className="w-full h-11" size={"lg"}>
                <ExternalLinkIcon className="mr-2 h-4 w-4" /> Tweak it
              </Button>
            </CardFooter>
          </div>

          <DialogClose className="absolute right-4 top-4">
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ id, label, value }) {
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
}

function extractS3KeyFromUrl(url) {
  const urlParts = new URL(url);
  // The pathname part of the URL starts with a '/', so we remove it
  const key = urlParts.pathname.substring(1);
  return key;
}
