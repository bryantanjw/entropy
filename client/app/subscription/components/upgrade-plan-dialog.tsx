import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircledIcon } from "@radix-ui/react-icons";

export function UpgradePlanDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upgrade</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-none">
        <Card className="justify-center text-center py-4">
          <CardHeader>
            <CardTitle className="text-xl">
              You&apos;re currently on the Free plan
            </CardTitle>
            <CardDescription>
              Choose from the plan options below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="free" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="free">Free</TabsTrigger>
                <TabsTrigger value="standard">Standard</TabsTrigger>
              </TabsList>
              <TabsContent value="free">
                <PlanTabs value="free" />
              </TabsContent>
              <TabsContent value="standard">
                <Label>Standard</Label>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

const PlanTabs = ({ value }: { value: string }) => {
  return (
    <div className="divide-y divide-gray-200 rounded-lg border text-left">
      <div className="flex flex-col p-4 gap-2">
        <p>
          <strong className="text-3xl font-semibold text-gray-900">
            {" "}
            $30{" "}
          </strong>

          <span className="text-sm font-light opacity-60">/month</span>
        </p>
        <p className="font-light text-sm">
          For users that want to keep their generations private.
        </p>
      </div>

      <div className="p-4 bg-muted">
        <ul className="space-y-2">
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-circle-check-filled h-6 w-6"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#fff"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
                stroke-width="0"
                fill="#57F0D4"
              />
            </svg>
            <span className="ml-2 text-gray-700 text-sm">
              {" "}
              5000 Credits/month{" "}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
