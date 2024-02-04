"use server";
import { stripe } from "@/lib/stripe";
import { getImages } from "@/sanity/sanity-utils";

export async function fetchImages({
  start = 0,
  search = "",
  style = "",
}: {
  start?: number;
  search?: string | undefined;
  style?: string | undefined;
}) {
  const data = await getImages(start, search, style);
  return data;
}
