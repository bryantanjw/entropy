import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

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

export async function uploadLora(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const blobResponse = await fetch(`/api/s3/upload-lora`, {
      method: "POST",
      body: formData,
    });
    console.log("blobResponse", blobResponse);

    if (!blobResponse.ok) {
      throw new Error(blobResponse.statusText);
    }

    const blob = await blobResponse.json();
    return blob;
  } catch (error) {
    throw new Error(error);
  }
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

export const deleteLoraFile = async (key: string): Promise<void> => {
  try {
    const response = await fetch("/api/s3/delete-lora", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete the file");
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};
