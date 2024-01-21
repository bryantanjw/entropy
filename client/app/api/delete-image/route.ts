import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function DELETE(request: Request) {
  const { userId, imageKey } = await request.json();
  const userPrefix = `user-${userId}`;

  // Ensure the imageKey starts with the user's prefix to avoid deleting other users' images
  if (!imageKey.startsWith(userPrefix)) {
    return new Response(JSON.stringify({ error: "Invalid image key" }), {
      headers: { "Content-Type": "application/json" },
      status: 403, // Forbidden
    });
  }

  try {
    const client = new S3Client({ region: process.env.AWS_REGION });

    // Delete the image from S3
    const deleteResult = await client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
      })
    );

    // The delete operation does not return any content on success
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 204, // No Content
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
