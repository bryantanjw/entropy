import { Column } from "@/components/ui/column";
import { Gallery } from "@/components/gallery";
import { InputForm } from "@/components/input-form";
import Navbar from "@/components/navbar";

import { getCharacters, getSession } from "@/lib/supabase-server";

export default async function Home() {
  const [session, characters] = await Promise.all([
    getSession(),
    getCharacters(),
  ]);

  const user = session?.user;

  return (
    <div className="max-w-7xl w-full mx-auto flex flex-col items-center">
      <Navbar />
      <Column className="w-full items-center min-h-screen pt-28 md:pt-44">
        <Column className="w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl">
          <InputForm user={user} characters={characters} />
          <Gallery />
        </Column>
      </Column>
    </div>
  );
}
