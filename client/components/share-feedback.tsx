import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "./ui/textarea";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { WavyBackground } from "./ui/wavy-bg";
import { AnimatedTabs } from "./ui/animated-tabs";

const tabs = [
  {
    title: "Request",
    value: "request",
    content: (
      <Card className="py-2 space-y-2">
        <WavyBackground waveWidth={100} className="mx-auto" />

        <CardHeader className="pt-1">
          <CardTitle className="text-xl">Request a Character</CardTitle>
          <CardDescription>
            Request a character to be added to the Entropy universe! We
            appreciate your ideas and will consider them for future updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="request"
            placeholder="Could you add Ryan Gosling?"
            className="min-h-[120px]"
          />
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="ghost">Cancel</Button>
          <Button>
            Send <ArrowTopRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    title: "Feedback",
    value: "feedback",
    content: (
      <Card className="py-2 space-y-2">
        <WavyBackground
          waveWidth={100}
          colors={[
            "#FF0000", // Red
            "#FF7F7F", // Light Red
            "#FF00FF", // Magenta
            "#FF1493", // Deep Pink
            "#FF69B4", // Hot Pink
          ]}
          className="mx-auto"
        />
        <CardHeader className="pt-1">
          <CardTitle className="text-xl">
            Loving Entropy or otherwise?
          </CardTitle>
          <CardDescription>
            Share your love, feature requests, ideas, or bug reports!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="feedback"
            placeholder="What if..."
            className="min-h-[120px]"
          />
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="ghost">Cancel</Button>
          <Button>
            Send <ArrowTopRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    ),
  },
];

export function ShareFeedback() {
  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40">
      <AnimatedTabs tabs={tabs} />
    </div>
  );
}

export function publishToLogSnag({ event, description, icon, ...props }) {
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
