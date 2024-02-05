import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fileField = formData.get("file");

    if (!fileField || !(fileField instanceof Blob)) {
      throw new Error("File not found or invalid file type.");
    }

    const key = `loras/${uuidv4()}.safetensors`;
    const client = new S3Client({ region: process.env.AWS_REGION });

    // Create an instance of the Upload class and configure it for the file upload
    const upload = new Upload({
      client: client,
      params: {
        Bucket: process.env.AWS_CUSTOM_LORA_BUCKET_NAME,
        Key: key,
        Body: fileField.stream(),
        ContentType: "application/octet-stream", // Or use fileField.type for the actual file type
      },
    });

    // Wait for the upload to complete
    await upload.done();

    const url = await getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: process.env.AWS_CUSTOM_LORA_BUCKET_NAME,
        Key: key,
      }),
      { expiresIn: 3600 }
    );

    return new Response(JSON.stringify({ key, url }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Failed to upload file to S3:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
