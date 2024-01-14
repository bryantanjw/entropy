import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Column } from "@/components/ui/column";
import { InputForm } from "@/components/input-form";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import ImageOutput from "./components/image-output";

import {
  getCharacters,
  getSession,
  getUserDetails,
} from "@/lib/supabase-server";

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
  const [session, userDetails, characters] = await Promise.all([
    getSession(),
    getUserDetails(),
    getCharacters(),
  ]);

  const user = session?.user;

  return (
    <div className="flex flex-col w-full items-center">
      <Navbar user={user} userDetails={userDetails} />
      <div className="w-full grid grid-cols-[1fr_0.18fr]">
        <Column className="items-center min-h-screen py-32 px-10">
          <Column className="w-full lg:max-w-4xl xl:max-w-6xl">
            <InputForm user={user} characters={characters} />
            <ImageOutput id={params.id} />
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
