"use client";

import { useEffect, useMemo, useState } from "react";
import { Icons } from "@/components/ui/icons";
import { InterstellarScroll } from "@/components/ui/interstellar-scroll";

import dynamic from "next/dynamic";

const HorizontalTiles = dynamic(
  () => import("@/components/ui/horizontal-tiles"),
  {
    loading: () => (
      <div className="flex justify-center -mt-32 items-center h-screen">
        <Icons.spinner className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    ),
  }
);

export const ProfileGallery = ({ userId }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (userId) {
      const fetchImages = async () => {
        const response = await fetch(`/api/list-images?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("data", data);
          setImages(data.images);
        } else {
          console.error("Failed to fetch images");
        }
      };

      fetchImages();
    }
  }, [userId]);

  // Remove image from state when it is deleted
  const removeImageFromState = (url) => {
    setImages((currentImages) =>
      currentImages.filter((image) => image.url !== url)
    );
  };

  return (
    <>
      {images && (
        <HorizontalTiles
          images={images}
          userId={userId}
          removeImageFromState={removeImageFromState}
        />
      )}
      {/* <InterstellarScroll
        images={images}
        userId={userId}
        removeImageFromState={removeImageFromState}
      /> */}
    </>
  );
};
