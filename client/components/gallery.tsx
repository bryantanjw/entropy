import { fetchImages } from "@/lib/actions";
import ImageGrid from "./image-grid";
import Filter from "./image-filter";
import DreiGallery from "./ui/drei-image-grid";

export async function Gallery() {
  const data = await fetchImages({ start: 0 });

  return (
    <>
      <div className="flex">
        <Filter />
      </div>
      <div className="items-center justify-center mb-6 h-[83vh]">
        <ImageGrid initialImages={data} />
        {/* <DreiGallery initialImages={data} /> */}
        {/* <HorizontalTiles /> */}
      </div>
    </>
  );
}
