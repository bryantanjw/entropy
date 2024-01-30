import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const { imageUrl, predictionInput } = await request.json();
  const key = `lora/${uuidv4()}`; // Generate the S3 object key with a 'lora' prefix and a UUID

  try {
    const client = new S3Client({ region: process.env.AWS_REGION });

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    // Base64 encode the predictionInput object
    const encodedPredictionInput = Buffer.from(
      JSON.stringify(predictionInput)
    ).toString("base64");
    const metadata = {
      prediction_input: encodedPredictionInput,
    };

    await client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: imageBuffer,
        ContentType: "image/png",
        ACL: "private",
        Metadata: metadata,
      })
    );

    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    // Generate a signed URL for the object
    const url = await getSignedUrl(client, getCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return new Response(JSON.stringify({ key, url }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
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
