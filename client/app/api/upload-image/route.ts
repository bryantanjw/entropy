import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const { imageUrl, userId, userEmail } = await request.json();
  const userPrefix = `user-${userId}`;
  const key = `${userPrefix}/${uuidv4()}`; // Generate the S3 object key with the user prefix and a UUID

  try {
    const client = new S3Client({ region: process.env.AWS_REGION });

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    // Convert the response body to a buffer
    const imageArrayBuffer = await imageResponse.arrayBuffer(); // Use arrayBuffer() instead of buffer()
    const imageBuffer = Buffer.from(imageArrayBuffer);

    // Upload the image buffer to S3
    const uploadResult = await client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: imageBuffer,
        ContentType: "image/png",
        ACL: "private", // Have to set private instead of public-read because our items are private
      })
    );

    // Return the URL to the uploaded object
    const uploadedImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return new Response(
      JSON.stringify({ success: true, url: uploadedImageUrl }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
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
