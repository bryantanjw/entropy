import { Column } from "@/components/ui/column";
import { Gallery } from "@/components/gallery";
import { InputForm } from "@/components/input-form";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

import {
  getCharacters,
  getGenerationCount,
  getSession,
  getSubscription,
} from "@/lib/supabase-server";
import { formatCount } from "@/lib/helpers";

export default async function Home() {
  const [session, characters, subscription, generationCount] =
    await Promise.all([
      getSession(),
      getCharacters(),
      getSubscription(),
      getGenerationCount(),
    ]);

  const user = session?.user;

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      <Navbar />
      <Column className="w-full items-center min-h-screen pt-28 md:pt-32">
        <Column className="w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl">
          <div className="thirteen w-fit relative mx-auto mb-8 px-4 py-1.5 text-sm font-light tracking-wide">
            {formatCount(generationCount)} images generated and counting!
          </div>
          <InputForm
            user={user}
            characters={characters}
            subscription={subscription}
          />
          <Gallery />
        </Column>
      </Column>
      <Footer />
    </div>
  );
}
