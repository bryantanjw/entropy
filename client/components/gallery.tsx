import { fetchImages } from "@/lib/actions";
import ImageGrid from "./image-grid";
import Filter from "./image-filter";

export async function Gallery() {
  const data = await fetchImages({ start: 0 });

  return (
    <>
      <div className="flex">
        <Filter />
      </div>
      <div className="items-center justify-center">
        <ImageGrid initialImages={data} />
      </div>
    </>
  );
}
