import { Column } from "@/components/ui/column";
import { Row } from "@/components/ui/row";
import { InputForm } from "@/components/input-form";
import Navbar from "@/components/navbar";
import Filter from "@/components/image-filter";
import ImageGrid from "@/components/image-grid";

import { fetchImages } from "@/lib/actions";
import { getSession, getUserDetails } from "@/lib/supabase-server";

export default async function Search({
  searchParams, // has to be searchParams. i think it's a next.js thing to recognize the query params
}: {
  searchParams: { search: string; style: string };
}) {
  const [session, userDetails] = await Promise.all([
    getSession(),
    getUserDetails(),
  ]);

  const user = session?.user;

  const search = searchParams.search || null;
  const style = searchParams.style || null;
  const data = await fetchImages({ start: 0, search, style });

  return (
    <div className="max-w-7xl w-full mx-auto flex flex-col items-center">
      <Navbar user={user} userDetails={userDetails} />
      <Column className="w-full items-center min-h-screen py-44">
        <Column className="w-full max-w-3xl lg:max-w-4xl xl:max-w-6xl">
          <InputForm />
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
