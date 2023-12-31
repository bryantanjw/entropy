"use client";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Suspense } from "react";

import { Skeleton } from "./ui/skeleton";
import { Icons } from "./ui/icons";
import ImageItem from "./image-item";

import { ImageDataType } from "@/sanity/types/ImageDataType";
import { fetchImages } from "@/lib/actions";

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
    console.log("initialImages", initialImages);
  }, [initialImages]);

  async function loadMoreImages() {
    const next = start + 30;
    const images = await fetchImages({ start: next, search, style });
    console.log("Fetched images:", images); // Add this line

    if (images.length) {
      setStart(next);
      setImages((prev) => [...(prev?.length ? prev : []), ...images]);
    } else {
      setHasMore(false);
    }
  }

  useEffect(() => {
    console.log("inView:", inView, "hasMore:", hasMore); // Add this line

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
      <main className="mt-6">
        <div
          className={clsx(
            "grid grid-cols-2 gap-x-4",
            "md:grid-cols-3",
            "lg:grid-cols-4 lg:gap-x-8"
          )}
        >
          {images.map((image, index) => (
            <ImageItem
              key={image._id}
              image={image}
              images={images}
              index={index}
              total={images.length}
            />
          ))}
        </div>

        {hasMore && (
          <div
            ref={ref}
            className={clsx(
              "h-[400px] w-full grid grid-cols-2 gap-x-4 gap-y-4",
              "md:grid-cols-3",
              "lg:grid-cols-4 lg:gap-x-8"
            )}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-full w-full" />
            ))}
          </div>
        )}
      </main>
    </Suspense>
  );
}
