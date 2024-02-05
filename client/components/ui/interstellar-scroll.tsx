"use client";

import clsx from "clsx";
import * as THREE from "three";
import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  Image as ImageDrei,
  ScrollControls,
  useScroll,
  Billboard,
  Text,
  Html,
} from "@react-three/drei";
import { easing, geometry } from "maath";
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

extend(geometry);

export function InterstellarScroll({ images, userId, removeImageFromState }) {
  return (
    <Canvas dpr={[1, 1.5]}>
      <ScrollControls pages={4} infinite>
        <Scene
          position={[0, 1.5, 0]}
          userId={userId}
          images={images}
          removeImageFromState={removeImageFromState}
        />
      </ScrollControls>
    </Canvas>
  );
}

function Scene({ images, ...props }) {
  const ref = useRef();
  const scroll = useScroll();
  const [hovered, hover] = useState(null);
  useFrame((state, delta) => {
    // @ts-ignore
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
    state.events.update(); // Raycasts every frame rather than on pointer-move
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 4, state.pointer.y * 3.5 + 4.5, 9],
      0.3,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
  return (
    <group ref={ref} {...props}>
      <Cards
        userId={props.userId}
        removeImageFromState={props.removeImageFromState}
        images={images}
        category="spring"
        from={0}
        len={Math.PI / 4}
        onPointerOver={hover}
        onPointerOut={hover}
      />
      {/* <Cards
          category="summer"
          from={0}
          len={Math.PI / 4}
          images={images.filter(img => img.category === 'summer')} // Filter images by category if needed
          onPointerOver={hover}
          onPointerOut={hover}
        /> */}
      <ActiveCard images={images} hovered={hovered} />
    </group>
  );
}

function Cards({
  images,
  category,
  from = 0,
  len = Math.PI * 2,
  radius = 5.25,
  onPointerOver,
  onPointerOut,
  ...props
}) {
  const [hovered, hover] = useState(null);
  const amount = images.length;
  const textPosition = from + (amount / 2 / amount) * len;
  return (
    <group {...props}>
      <Billboard
        position={[
          Math.sin(textPosition) * radius * 1.4,
          0.5,
          Math.cos(textPosition) * radius * 1.4,
        ]}
      >
        <Text fontSize={0.25} anchorX="center" color="white">
          {category}
        </Text>
      </Billboard>
      {images.map((image, i) => {
        const angle = from + (i / amount) * len;
        return (
          <Card
            removeImageFromState={props.removeImageFromState}
            userId={props.userId}
            key={image.key}
            url={image.url}
            metadata={image.metadata}
            onPointerOver={(e) => (
              e.stopPropagation(), hover(i), onPointerOver(i)
            )}
            onPointerOut={() => (hover(null), onPointerOut(null))}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            active={hovered !== null}
            hovered={hovered === i}
          />
        );
      })}
    </group>
  );
}

function Card({ url, metadata, active, hovered, ...props }) {
  const ref = useRef();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleDialog = () => setDialogOpen(!isDialogOpen);

  return (
    <group {...props}>
      <ImageDrei
        // @ts-ignore
        alt="image"
        ref={ref}
        url={url}
        side={THREE.DoubleSide}
        onClick={toggleDialog}
      />
      <Html>
        <ImageDialog
          removeImageFromState={props.removeImageFromState}
          userId={props.userId}
          url={url}
          metadata={metadata}
          isDialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
      </Html>
    </group>
  );
}

function ActiveCard({ hovered, images, ...props }) {
  const ref = useRef();
  const name = "test"; // You might want to get the actual name from the image data

  // Ensure that imageUrl is set to a valid URL or null
  const imageUrl =
    hovered != null && images[hovered] ? images[hovered].url : null;

  useLayoutEffect(() => {
    // @ts-ignore
    if (ref.current?.material) {
      // @ts-ignore
      ref.current.material.zoom = 0.8;
    }
  }, [hovered]);

  useFrame((state, delta) => {
    // @ts-ignore
    if (ref.current?.material) {
      // @ts-ignore
      easing.damp(ref.current.material, "zoom", 1, 0.5, delta);
      easing.damp(
        // @ts-ignore
        ref.current.material,
        "opacity",
        hovered != null ? 1 : 0,
        0.3,
        delta
      );
    }
  });

  // If imageUrl is null, do not render the Image component
  return (
    <Billboard {...props}>
      <Text
        fontSize={0.5}
        position={[2.15, 3.85, 0]}
        anchorX="left"
        color="white"
      >
        {hovered != null && `${name}\n${hovered}`}
      </Text>
      {imageUrl && (
        <ImageDrei
          /* @ts-ignore */
          alt="image"
          ref={ref}
          transparent
          position={[0, 1.5, 0]}
          url={imageUrl} // Use the dynamic image URL
        >
          {/* @ts-ignore */}
          <roundedPlaneGeometry
            parameters={{ width: 3.5, height: 1.618 * 3.5 }}
            args={[3.5, 1.618 * 3.5, 0.1]}
          />
        </ImageDrei>
      )}
    </Billboard>
  );
}

function ImageDialog({
  userId,
  url,
  metadata,
  isDialogOpen,
  setDialogOpen,
  setIsLoading,
  isLoading,
  removeImageFromState,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const handleDeleteImage = async (url) => {
    setIsDeleting(true);
    const imageKey = extractS3KeyFromUrl(url);

    try {
      const response = await fetch("/api/s3/delete-image", {
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
