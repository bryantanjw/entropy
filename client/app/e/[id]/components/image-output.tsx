"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImageOutput({ id }) {
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function pollAPI() {
      while (!predictions && id && !isCancelled) {
        try {
          let pollRes = await fetch(
            `https://api.entropy.so/predictions/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + process.env.REPLICATE_API_KEY,
              },
            }
          );
          let pollResponse = await pollRes.json();

          if (pollResponse.status === "succeeded") {
            if (!isCancelled) {
              setPredictions(pollResponse);
            }
          } else if (pollResponse.status === "failed") {
            throw new Error("Prediction failed");
          } else {
            // Delay to make requests to API Gateway every 3 seconds
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        } catch (error) {
          if (!isCancelled) {
            setError(error.message);
          }
          break;
        }
      }
    }

    pollAPI();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!predictions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-wrap flex-grow gap-6">
      <figure className="relative flex-grow h-64 overflow-hidden">
        <Image
          fill={true}
          src={predictions.output[0]}
          className="object-cover"
          alt={predictions.input_prompt}
        />
      </figure>
      <div className="bg-muted flex-grow h-64"></div>
      <div className="bg-muted flex-grow h-64"></div>
      <div className="bg-muted flex-grow h-64"></div>
    </div>
  );
}
