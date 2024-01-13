import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "./ui/textarea";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

export function ShareFeedback() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2 h-11">
        <TabsTrigger value="account" className="py-2">
          Reqeust
        </TabsTrigger>
        <TabsTrigger value="password" className="py-2">
          Feedback
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Request a Character</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you&apos;re
              done.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="request"
              placeholder="What if..."
              className="min-h-[120px]"
            />
          </CardContent>
          <CardFooter>
            <Button>
              Send <PaperPlaneIcon className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader className="gap-2">
            <CardTitle>Loving Entropy? Or Not?</CardTitle>
            <CardDescription>
              Share your love, feature requests, ideas, or bug reports!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              id="feedback"
              placeholder="What if..."
              className="min-h-[120px]"
            />
          </CardContent>
          <CardFooter>
            <Button>
              Send <PaperPlaneIcon className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export function publishToLogSnag({ event, description, icon, ...props }) {
  // replace your LogSnag token here.
  let LOGSNAG_TOKEN = process.env.NEXT_PUBLIC_LOGSNAG_TOKEN;

  var requestOptions = {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + LOGSNAG_TOKEN,
    }),
    body: JSON.stringify({
      project: "entropy",
      channel: "feedback",
      event: event,
      description: description,
      icon: icon,
      ...props,
    }),
  };

  fetch("https://api.logsnag.com/v1/log", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}
