"use client";

import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";

import { Icons } from "./ui/icons";
import ImageItem from "./image-item";

import { ImageDataType } from "@/sanity/types/ImageDataType";
import { fetchImages } from "@/lib/actions";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

export default function ImageGrid({
  initialImages,
  search,
  style,
}: {
  initialImages: ImageDataType[];
  search?: string;
  style?: string;
}) {
  const topOfRef = useRef(null);
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
    <>
      <div
        ref={topOfRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-10 py-12"
      >
        {images.map((image, index) => (
          <ImageItem
            gridRef={topOfRef}
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
          className={cn(
            "h-[400px] w-full grid grid-cols-2 gap-x-4 gap-y-4",
            "md:grid-cols-3"
          )}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-full w-full" />
          ))}
        </div>
      )}
    </>
  );
}
