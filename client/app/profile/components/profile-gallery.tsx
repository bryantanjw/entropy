"use client";

import { useEffect, useMemo, useState } from "react";
import { Icons } from "@/components/ui/icons";
import { InterstellarScroll } from "@/components/ui/interstellar-scroll";
import { HorizontalTiles } from "@/components/ui/horizontal-tiles";

export const ProfileGallery = ({ userId }) => {
  const [images, setImages] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Memoize the images so they are not refetched unless the userId changes
  const memoizedImages = useMemo(() => images, [images]);

  useEffect(() => {
    if (!memoizedImages.length && !isFetching) {
      setIsFetching(true);
      const fetchImages = async () => {
        const response = await fetch(`/api/list-images?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setImages(data.images);
        } else {
          console.error("Failed to fetch images");
        }
        setIsFetching(false);
      };

      fetchImages();
    }
  }, [userId, memoizedImages.length, isFetching]);

  // Remove image from state when it is deleted
  const removeImageFromState = (url) => {
    setImages((currentImages) =>
      currentImages.filter((image) => image.url !== url)
    );
  };

  return (
    <>
      {!images.length ? (
        <div className="flex justify-center items-center h-screen">
          <Icons.spinner className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <HorizontalTiles images={images} />
      )}
      {/* <InterstellarScroll
        images={images}
        userId={userId}
        removeImageFromState={removeImageFromState}
      /> */}
    </>
  );
};
