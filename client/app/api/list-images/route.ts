import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId");
  if (!userId) {
    return new Response(JSON.stringify({ error: "UserId is required" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  const userPrefix = `user-${userId}`;
  const client = new S3Client({ region: process.env.AWS_REGION });

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: userPrefix,
    });

    const { Contents } = await client.send(listCommand);

    // Generate signed URLs for each object
    const imagesWithMetadata = await Promise.all(
      Contents.map(async (content) => {
        const getCommand = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: content.Key,
        });

        // Fetch the object metadata
        const { Metadata } = await client.send(getCommand);

        // Decode the metadata if it's base64-encoded
        const predictionInput =
          Metadata && Metadata.prediction_input
            ? JSON.parse(
                Buffer.from(Metadata.prediction_input, "base64").toString(
                  "utf-8"
                )
              )
            : null;

        // Generate a signed URL for the object
        const url = await getSignedUrl(client, getCommand, {
          expiresIn: 3600, // URL expires in 1 hour
        });

        return {
          key: content.Key,
          url: url,
          metadata: predictionInput, // Include the metadata in the response
        };
      })
    );

    return new Response(
      JSON.stringify({ success: true, images: imagesWithMetadata }),
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
