"use client";

import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

import { Skeleton } from "./ui/skeleton";
import { Icons } from "./ui/icons";
import ImageItem from "./image-item";

import { ImageDataType } from "@/sanity/types/ImageDataType";
import { fetchImages } from "@/lib/actions";
import { CardContainer, CardItem } from "./ui/3d-card";

export default function ImageGrid({
  initialImages,
  search,
  style,
}: {
  initialImages: ImageDataType[];
  search?: string;
  style?: string;
}) {
  const [images, setImages] = useState(initialImages);
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [ref, inView] = useInView();

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  async function loadMoreImages() {
    const next = start + 60;
    const images = await fetchImages({ start: next, search, style });

    if (images.length) {
      setStart(next);
      setImages((prev) => [...(prev?.length ? prev : []), ...images]);
    } else {
      setHasMore(false);
    }
  }

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreImages();
    }
  }, [inView, hasMore]);

  return (
    <Suspense
      fallback={
        <div className="mt-12 flex flex-col items-center justify-center">
          <p className="text-sm text-neutral-seven dark:text-neutral-four">
            Loading...
          </p>
          <span className="sr-only">Loading</span>
          <Icons.spinner className="animate-spin-fast stroke-neutral-seven stroke-[1.5] dark:stroke-neutral-four" />
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-10 my-10">
        {images.map((image, index) => (
          <CardContainer key={image._id}>
            <CardItem translateZ="100" className="relative">
              <ImageItem
                image={image}
                images={images}
                index={index}
                total={images.length}
              />
            </CardItem>
          </CardContainer>
        ))}
        {hasMore && (
          <div
            ref={ref}
            className={cn(
              "h-[400px] w-full grid grid-cols-2 gap-x-4 gap-y-4",
              "md:grid-cols-3",
              "lg:grid-cols-4 lg:gap-x-8"
            )}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-full w-full" />
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
}
