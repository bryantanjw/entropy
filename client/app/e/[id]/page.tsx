import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Column } from "@/components/ui/column";
import { Row } from "@/components/ui/row";
import { InputForm } from "@/components/form";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}): Promise<Metadata | undefined> {
  const title = `Entropy`;
  const description = `Check out my character generated using Entropy!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@bryantanjw",
    },
  };
}

export default async function GenerationPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  // Poll the API Gateway endpoint for the status using the prediction ID
  let predictions = null;
  while (!predictions && params.id) {
    let pollRes = await fetch(
      `https://api.entropy.so/predictions/${params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_KEY,
        },
      }
    );
    let pollResponse = await pollRes.json();
    const { status, logs } = pollResponse;

    if (pollResponse.status === "succeeded") {
      predictions = pollResponse;
      console.log("predictions", predictions);
    } else if (pollResponse.status === "failed") {
      break;
    } else {
      // Delay to make requests to API Gateway every 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  return (
    <div className="flex flex-col w-full items-center">
      <Navbar />
      <div className="w-full grid grid-cols-[1fr_0.18fr]">
        <Column className="items-center min-h-screen py-32 px-10">
          <Column className="w-full lg:max-w-4xl xl:max-w-6xl">
            <InputForm />
            <Row className="my-20 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
            <div className="flex flex-wrap flex-grow gap-6">
              <div className="bg-muted flex-grow h-64"></div>
              <div className="bg-muted flex-grow h-64"></div>
              <div className="bg-muted flex-grow h-64"></div>
              <div className="bg-muted flex-grow h-64"></div>
            </div>
          </Column>
        </Column>

        {/* Side Menu */}
        <div className="flex flex-col gap-12 border mt-12 px-5 py-8">
          <div className="flex justify-between items-center">
            <span>Recent</span>
            <Button variant={"secondary"} size={"sm"} className="opacity-70">
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="bg-muted h-9 flex-grow"></div>
            <div className="bg-muted h-9 flex-grow"></div>
            <div className="bg-muted h-9 flex-grow"></div>
            <div className="bg-muted h-9 flex-grow"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
