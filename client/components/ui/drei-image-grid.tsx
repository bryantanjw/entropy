// @ts-nocheck

"use client";

import * as THREE from "three";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Preload,
  Image as ImageImpl,
  Html,
  useIntersect,
  ScrollControls,
  Scroll,
} from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fetchImages } from "@/lib/actions";

function Image({ url, alt, ...props }) {
  const texture = useLoader(THREE.TextureLoader, url);
  const { viewport } = useThree();
  const scale = useRef([0, 0, 0]);

  // Wait for the texture to be loaded to access its dimensions
  if (texture.image) {
    const imageAspectRatio =
      texture.image.naturalWidth / texture.image.naturalHeight;
    // Determine the scale based on the desired coverage of the viewport width
    // For example, if you want the image to cover half the viewport width
    const divisor = 2.8; // Increase this number to make the image smaller
    const desiredWidth = viewport.width / divisor;
    const imageWidth = desiredWidth;
    const imageHeight = desiredWidth / imageAspectRatio;
    scale.current = [imageWidth, imageHeight, 1];
  }

  return texture.image ? (
    // @ts-ignore
    <ImageImpl {...props} alt={alt} scale={scale.current} url={url} />
  ) : null;
}

function Page({ m = 0.4, urls, ...props }) {
  const { width } = useThree((state) => state.viewport);
  const w = width < 10 ? 1.5 / 3 : 1 / 3;
  return (
    <group {...props}>
      <Image
        alt={"Entropy image"}
        position={[-width * w, 0, -1]}
        url={urls[0]}
      />
      <Image
        alt={"Entropy image"}
        position={[0, 0, 0]}
        scale={[width * w - m * 2, 5, 1]}
        url={urls[1]}
      />
      <Image
        alt={"Entropy image"}
        position={[width * w, 0, 1]}
        scale={[width * w - m * 2, 5, 1]}
        url={urls[2]}
      />
    </group>
  );
}

function Pages({ initialImages }) {
  const [images, setImages] = useState(initialImages.slice(0, 3));
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { width } = useThree((state) => state.viewport);
  const pages = [];

  const visible = useRef(false);
  const ref = useIntersect((isVisible) => (visible.current = isVisible));

  const loadMoreImages = async () => {
    const next = start + 30;
    const nextImages = await fetchImages({ start: next });
    if (nextImages.length > 0) {
      setStart(next);
      setImages((prevImages) => [...prevImages, ...nextImages]);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    setImages(initialImages);
    console.log(initialImages.length);
  }, [initialImages]);

  useEffect(() => {
    if (visible && hasMore) {
      loadMoreImages();
    }
  }, [visible, hasMore]);

  for (let i = 0; i < images.length; i += 3) {
    const imageUrls = images.slice(i, i + 3).map((img) => img.image_url);
    pages.push(
      <Page
        key={`page-${i / 3}`}
        position={[width * (i / 3), 0, 0]}
        urls={imageUrls}
      />
    );
  }

  return (
    <>
      {pages}
      <Scroll html>
        <div
          ref={ref}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Scroll>
    </>
  );
}

export default function DreiGallery({ initialImages }) {
  const numPages = Math.ceil(initialImages.length / 3);

  return (
    <AnimatePresence mode="wait">
      <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ScrollControls horizontal damping={4} pages={numPages} distance={3}>
            <Scroll>
              <Pages initialImages={initialImages} />
            </Scroll>
          </ScrollControls>
          <Preload />
        </Suspense>
      </Canvas>
    </AnimatePresence>
  );
}
// const StyledHeader = ({ children, style }) => {
//   const combinedStyles = {
//     fontSize: "30vw",
//     fontWeight: 400,
//     letterSpacing: "-0.05em",
//     lineHeight: "0.7em",
//     margin: 0,
//     padding: 0,
//     color: "black",
//     ...style, // This will merge the passed style prop with the default styles
//   };

//   return <h1 style={combinedStyles}>{children}</h1>;
// };
