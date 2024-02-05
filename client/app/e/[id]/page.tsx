import { Metadata } from "next";

import { Column } from "@/components/ui/column";
import { InputForm } from "@/components/input-form";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";

import { getCharacters, getSession } from "@/lib/supabase-server";
import OutputImages from "./components/output-images";

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}): Promise<Metadata | undefined> {
  const title = `Output | Entropy`;
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
  const [session, characters] = await Promise.all([
    getSession(),
    getCharacters(),
  ]);

  const user = session?.user;

  return (
    <div className="flex flex-col w-full items-center">
      <Navbar />

      <div className="w-full grid grid-cols-[1fr_0.18fr]">
        <Column className="items-center min-h-screen py-28 px-10">
          <Column className="w-full h-full lg:max-w-4xl xl:max-w-6xl">
            <InputForm user={user} characters={characters} />
            <OutputImages id={params.id} />
          </Column>
        </Column>

        {/* Side Menu */}
        <div className="flex flex-col gap-12 border mt-12 px-5 py-8 bg-muted">
          {/* <div className="flex justify-between items-center">
            <span className="opacity-60 text-sm">Recent</span>
            <Button variant={"secondary"} size={"sm"} className="opacity-70">
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="bg-muted h-9 flex-grow"></div>
            <div className="bg-muted h-9 flex-grow"></div>
            <div className="bg-muted h-9 flex-grow"></div>
            <div className="bg-muted h-9 flex-grow"></div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
