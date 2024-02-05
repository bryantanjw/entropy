import { fetchImages } from "@/lib/actions";
import ImageGrid from "./image-grid";
import Filter from "./image-filter";
import DreiGallery from "./ui/drei-image-grid";
import { Row } from "./ui/row";

export async function Gallery() {
  const data = await fetchImages({ start: 0 });

  return (
    <>
      <Row className="my-24 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      <div className="flex">
        <Filter />
      </div>
      <div className="items-center justify-center mb-6 h-[83vh]">
        <ImageGrid initialImages={data} />
        {/* <DreiGallery initialImages={data} /> */}
      </div>
    </>
  );
}
