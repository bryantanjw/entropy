import { Metadata } from "next";
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

export default function GenerationPage() {
  return (
    <div className="flex flex-col w-full items-center">
      <Navbar />
      <div className="w-full grid grid-cols-[1fr_0.2fr]">
        <Column className="items-center min-h-screen py-32">
          <Column className="w-full lg:max-w-4xl xl:max-w-5xl">
            <InputForm />
            <Row className="my-20 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
            <div className="flex flex-wrap gap-6">
              <div className="bg-muted h-64 w-64"></div>
              <div className="bg-muted h-64 w-64"></div>
              <div className="bg-muted h-64 w-64"></div>
              <div className="bg-muted h-64 w-64"></div>
            </div>
          </Column>
        </Column>

        {/* Side Menu */}
        <div className="flex flex-col gap-12 border mt-12 p-7 py-8">
          <div className="flex justify-between items-center">
            <span>Recent</span>
            <Button variant={"secondary"} size={"sm"} className="opacity-70">
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="bg-muted h-12 w-12"></div>
            <div className="bg-muted h-12 w-12"></div>
            <div className="bg-muted h-12 w-12"></div>
            <div className="bg-muted h-12 w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
