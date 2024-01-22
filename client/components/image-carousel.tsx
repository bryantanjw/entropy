import Image from "next/image";
import { CardContainer, CardItem } from "./ui/3d-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const ImageCarousel = ({ images, character }) => {
  return (
    <Carousel
      className="w-full max-w-xs px-4 py-4"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {images.map((_, index) => (
          <CarouselItem key={index}>
            <Image
              width={720}
              height={1080}
              src={images[index].src}
              alt={character.name}
              className={`w-[300px] h-[400px] object-cover ${images[index].imagePosition} rounded-lg shadow-lg`}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
