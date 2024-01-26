import { Metadata } from "next";
import { Column } from "@/components/ui/column";
import { Row } from "@/components/ui/row";
import { InputForm } from "@/components/input-form";
import Navbar from "@/components/navbar";
import Filter from "@/components/image-filter";
import ImageGrid from "@/components/image-grid";

import { fetchImages } from "@/lib/actions";
import { getCharacters, getSession } from "@/lib/supabase-server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    search: string;
    style: string;
  };
}): Promise<Metadata | undefined> {
  const title = `${searchParams.search} | Entropy AI`;
  const description = `Imagine your favourite characters.`;

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

export default async function Search({
  searchParams,
}: {
  searchParams: { search: string; style: string };
}) {
  const [session, characters] = await Promise.all([
    getSession(),
    getCharacters(),
  ]);

  const user = session?.user;

  const search = searchParams.search || null;
  const style = searchParams.style || null;
  const data = await fetchImages({ start: 0, search, style });

  return (
    <div className="max-w-7xl w-full mx-auto flex flex-col items-center">
      <Navbar />
      <Column className="w-full items-center min-h-screen py-44">
        <Column className="w-full max-w-3xl lg:max-w-4xl xl:max-w-6xl">
          <InputForm user={user} characters={characters} />
          <Row className="my-24 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

          <div className="flex">
            <Filter search={search} style={style} />
          </div>
          <div className="items-center justify-center">
            <ImageGrid initialImages={data} search={search} style={style} />
          </div>
        </Column>
      </Column>
    </div>
  );
}
