import OutputImage from "../components/output-image";
import Navbar from "@/components/navbar";
import { Column } from "@/components/ui/column";
import { Edits } from "../components/edits";
import { getSession } from "@/lib/supabase-server";

export default async function ImagePage({
  params,
}: {
  params: { id: string; subid: string };
}) {
  const predictionId = params.id;
  const subid = params.subid.slice(0, -1); // remove last character as it is the image index
  const index = params.subid.slice(-1);

  const session = await getSession();
  const user = session?.user;

  return (
    <div className="flex flex-col w-full items-center">
      <Navbar />
      <div className="w-full grid md:grid-cols-[1fr_0.18fr] justify-center px-4 md:px-0">
        <Column className="items-center min-h-screen py-20 px-0 md:px-10 gap-8">
          <Edits
            user={user}
            predictionId={predictionId}
            path={`${subid}`}
            index={index}
          />
          <Column className="max-h-screen my-auto">
            <OutputImage path={`${subid}`} index={index} predictionId={predictionId} />
          </Column>
        </Column>

        {/* Side Menu */}
        <div className="hidden md:flex flex-col gap-12 border mt-12 px-5 py-8 bg-muted">
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
