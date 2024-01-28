import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import type { PutBlobResult } from "@vercel/blob";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const signInFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export const forgotPasswordFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

export async function getBlobs() {
  const res = await fetch("/api/blob/get-blobs");
  const data = await res.json();
  console.log(data);
}

export async function uploadBlob(file) {
  let blob: PutBlobResult;
  try {
    const blobResponse = await fetch(
      `/api/blob/upload-blob?filename=${file.name}`,
      {
        method: "POST",
        body: file,
      }
    );

    if (!blobResponse.ok) {
      throw new Error("Failed to upload file");
    }

    blob = await blobResponse.json();
    console.log("blob", blob);
  } catch (error) {
    console.error(error);
    return;
  }
  return blob;
}

export const deleteBlob = async (blob) => {
  const urls = [blob.url];

  const delBlobResponse = await fetch("/api/blob-blob", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ urls }), // Send the URLs in the request body
  });

  if (!delBlobResponse.ok) {
    throw new Error("Failed to delete file");
  }
  console.log("delBlobResponse", delBlobResponse);
};
