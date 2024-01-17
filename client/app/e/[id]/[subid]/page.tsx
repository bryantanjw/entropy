import OutputImage from "../components/image";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Column } from "@/components/ui/column";
import { getSession, getUserDetails } from "@/lib/supabase-server";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default async function ImagePage({
  params,
}: {
  params: { id: string; subid: string };
}) {
  const [session, userDetails] = await Promise.all([
    getSession(),
    getUserDetails(),
  ]);
  const user = session?.user;

  const subid = params.subid.slice(0, -1);
  const index = params.subid.slice(-1);

  return (
    <div className="flex flex-col w-full items-center">
      <Navbar user={user} userDetails={userDetails} />
      <div className="w-full grid grid-cols-[1fr_0.18fr]">
        <Column className="items-center min-h-screen py-20 px-10 gap-4">
          <div className="flex w-full justify-between">
            <Button
              variant="ghost"
              className="items-center"
              // onClick={() => router.back()}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button>Save</Button>
          </div>
          <Column className="w-full max-w-lg">
            <OutputImage path={`${subid}`} index={index} />
          </Column>
        </Column>

        {/* Side Menu */}
        <div className="flex flex-col gap-12 border mt-12 px-5 py-8 bg-muted">
          <div className="flex justify-between items-center">
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
          </div>
        </div>
      </div>
    </div>
  );
}
