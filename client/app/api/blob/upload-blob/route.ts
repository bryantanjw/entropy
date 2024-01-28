/**
 * This file handles the POST request for file uploads.
 * It uses the @vercel/blob package to store the uploaded file as a blob.
 * The filename is extracted from the request URL's search parameters.
 * The blob is stored with public access.
 * The function returns a JSON response containing the blob data.
 */

import { put, BlobAccessError } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  try {
    const blob = await put(filename, request.body, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error) {
    if (error instanceof BlobAccessError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // throw the error again if it's unknown
      throw error;
    }
  }
}
