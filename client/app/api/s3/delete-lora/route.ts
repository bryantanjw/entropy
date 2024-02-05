import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function DELETE(request: Request) {
  try {
    const { key } = await request.json();
    const client = new S3Client({ region: process.env.AWS_REGION });
    await client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_CUSTOM_LORA_BUCKET_NAME,
        Key: key,
      })
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Failed to delete LoRA file from S3:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
