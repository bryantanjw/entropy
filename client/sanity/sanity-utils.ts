import { createClient, groq } from "next-sanity";
import clientConfig from "./config/client-config";
import { ImageDataType } from "./types/ImageDataType";

export async function getImages(
  start: number,
  search: string,
  style: string
): Promise<ImageDataType[]> {
  let lastId: string | null = "";
  if (lastId === null) {
    return [];
  }

  const result = await createClient(clientConfig).fetch(
    groq`*[_type == "gallery" ${
      search
        ? `&& (title match "*${search}*" || tagsString match "*${search}*")`
        : ""
    } ${
      style ? `&& style == "${style}"` : ""
    }] | order(_updatedAt desc) [$start...${start + 60}] {
      _id,
      title,
      ratio,
      category,
      style,
      origin,
      "image_url": image.asset->url,
      "prompt": image.prompt,
      "negative_prompt": image.negative_prompt,
      "model": image.model,
      "steps": image.steps,
      "seed": image.seed,
      "cfg_scale": image.cfg_scale,
      "sampler": image.sampler,
      tags
    }`,
    { start, lastId, style }
  );

  if (result && result.length > 0) {
    lastId = result[result.length - 1]._id;
  } else {
    lastId = null; // Reached the end
  }

  return result;
}

// export async function getByStyle(
//   start: number,
//   search: string,
//   style: string
// ): Promise<ImageDataType[]> {
//   let lastId: string | null = "";
//   if (lastId === null) {
//     return [];
//   }

//   const result = await createClient(clientConfig).fetch(
//     groq` *[_type == "gallery" && style == $style] |  order(_updatedAt desc) [$start...${
//       start + 4
//     }] {
//       _id,
//       title,
//       ratio,
//       category,
//       style,
//       origin,
//       "image_url": image.asset->url,
//       "prompt": image.prompt,
//       "negative_prompt": image.negative_prompt,
//       "model": image.model,
//       "steps": image.steps,
//       "seed": image.seed,
//       "cfg_scale": image.cfg_scale,
//       "sampler": image.sampler,
//       tags
//     }`,
//     { start, style, lastId }
//   );

//   if (result && result.length > 0) {
//     lastId = result[result.length - 1]._id;
//   } else {
//     lastId = null; // Reached the end
//   }

//   return result;
// }
