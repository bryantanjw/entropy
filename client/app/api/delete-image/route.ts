import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function DELETE(request: Request) {
  const { userId, imageKey } = await request.json();
  const userPrefix = `user-${userId}`;

  if (!imageKey.startsWith(userPrefix)) {
    return new Response(JSON.stringify({ error: "Invalid image key" }), {
      headers: { "Content-Type": "application/json" },
      status: 403,
    });
  }

  const client = new S3Client({ region: process.env.AWS_REGION });

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
      })
    );

    return new Response(null, {
      headers: { "Content-Type": "application/json" },
      status: 204,
    });
  } catch (error) {
    console.error("Error deleting image:", error);

    // Determine if the error is due to AWS S3 or another issue
    if (error.name === "NoSuchKey") {
      return new Response(JSON.stringify({ error: "Image not found" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    } else {
      // For other types of errors, return a 500 error
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }
  }
}
