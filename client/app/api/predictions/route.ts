/**
 * Currently deployed in an AWS Lambda Function: pollPredictions
 *
 * This function polls the status of an image generation process
 * by making a GET request to the Replicate API using a provided prediction ID.
 *
 * Input:
 * - event.pathParameters.id: Contains the prediction ID used to poll the status.
 *
 * Output:
 * - Success: Returns the current status of the prediction, which can be 'succeeded', 'failed', or 'in-progress'.
 * - Error: Returns an error status and message.
 *
 * Dependencies:
 * - Replicate API
 *
 * Error Handling:
 * - Returns appropriate error messages based on the Replicate API response or any internal errors.
 * - Handles scenarios where the Replicate API returns a non-200 status code.
 */

import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/lambdas/generatePredictions/utils/redis";

// Create a new ratelimiter, that allows 5 requests per 24 hours
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(5, "1440 m"),
      analytics: true,
    })
  : undefined;

export async function POST(request: Request) {
  if (!request) {
    throw new Error("Request object is undefined");
  }

  // Rate Limiter Code
  if (ratelimit) {
    const headersList = headers();
    const ipIdentifier = headersList.get("x-real-ip");

    const result = await ratelimit.limit(ipIdentifier ?? "");

    if (!result.success) {
      return new Response(
        "Too many uploads in 1 day. Please try again in a 24 hours.",
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": result.limit,
            "X-RateLimit-Remaining": result.remaining,
          } as any,
        }
      );
    }
  }

  const req = await request.json(); // Parse the request body once

  const {
    prompt,
    url,
    negativePrompt,
    inferenceStep,
    guidance,
    strength,
    controlnetConditioning,
    seed,
  } = req;

  console.log("req body", req);

  // POST request to Replicate to start the image restoration generation process
  console.log("Start /predictions POST request");
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
    body: JSON.stringify({
      version:
        "3c64e669051f9b358e748c8e2fb8a06e64122a9ece762ef133252e2c99da77c1",
      input: {
        prompt,
        qr_code_content: url,
        negative_prompt: negativePrompt,
        num_inference_steps: inferenceStep,
        guidance_scale: guidance,
        seed,
        strength,
        controlnet_conditioning_scale: controlnetConditioning,
        batch_size: 1,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status !== 201) {
    let error = await response.json();
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: "error",
        message: error.detail,
      }),
    };
  }

  const prediction = await response.json();
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(prediction),
  };
}
