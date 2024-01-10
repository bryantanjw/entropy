/**
 * This function cancels an ongoing image generation process
 * by making a POST request to the Replicate API using a provided prediction ID.
 *
 * Input:
 * - event.pathParameters.id: Contains the prediction ID used to cancel the process.
 *
 * Output:
 * - Success: Returns a success status and message.
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

export async function POST(request: Request) {
  if (!request) {
    throw new Error("Request object is undefined");
  }

  const { predictionId } = await request.json(); // Parse the request body once

  // POST request to Replicate to cancel the image generation process
  console.log("Start /predictions cancel request");
  const response = await fetch(
    `https://api.replicate.com/v1/predictions/${predictionId}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status !== 200) {
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

  const cancelResponse = await response.json();
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(cancelResponse),
  };
}
