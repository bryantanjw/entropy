"use client";

import * as z from "zod";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { WavyBackground } from "./ui/wavy-bg";
import { AnimatedTabs } from "./ui/animated-tabs";
import { Icons, SuccessIcon } from "./ui/icons";
import { toast } from "sonner";
import { Dialog, DialogContent } from "./ui/dialog";

const requestFormSchema = z.object({
  request: z.string().min(1, {
    message: "Form is empty :(",
  }),
});
const feedbackFormSchema = z.object({
  feedback: z.string().min(1, {
    message: "Form is empty :(",
  }),
});

interface ShareFeedbackProps {
  email: string | null | undefined;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export function ShareFeedback({ email, open, setOpen }: ShareFeedbackProps) {
  const [isRequestSubmitting, setRequestSubmitting] = useState(false);
  const [isFeedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [isRequestSuccess, setRequestSuccess] = useState(false);
  const [isFeedbackSuccess, setFeedbackSuccess] = useState(false);

  const requestForm = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
  });

  const feedbackForm = useForm<z.infer<typeof feedbackFormSchema>>({
    resolver: zodResolver(feedbackFormSchema),
  });

  async function onRequestSubmit(values: z.infer<typeof requestFormSchema>) {
    console.log(values);
    setRequestSubmitting(true);

    // publish the event to LogSnag
    try {
      await publishToLogSnag({
        event: "Reqest Received",
        description: values.request,
        icon: "🙋🏼‍♀️",
        notify: true,
        tags: {
          email: email,
          type: "request",
        },
      });

      setTimeout(() => {
        setRequestSubmitting(false);
        setRequestSuccess(true);
        toast.success("Request received!", {
          description: "We'll notify you when it's added.",
        });
        setTimeout(() => {
          setRequestSuccess(false);
        }, 2000);
      }, 2000);
    } catch (error) {
      setRequestSubmitting(false);
      toast.error("Failed to submit request.", {
        description:
          error.message || "An error occurred while submitting your request.",
      });
    }
  }

  async function onFeedbackSubmit(values: z.infer<typeof feedbackFormSchema>) {
    console.log(values);
    setFeedbackSubmitting(true);

    // publish the event to LogSnag
    try {
      await publishToLogSnag({
        event: "Feedback Submitted",
        description: values.feedback,
        icon: "😍",
        notify: true,
        tags: {
          email: email,
          type: "feedback",
        },
      });

      setTimeout(() => {
        setFeedbackSubmitting(false);
        setFeedbackSuccess(true);
        toast.success("Feedback received. Thanks for using Entropy!");
        setFeedbackSubmitting(false);
        setTimeout(() => {
          setFeedbackSuccess(false);
        }, 2000);
      }, 2000);
    } catch (error) {
      setFeedbackSubmitting(false);
      toast.error("Failed to send feedback.", {
        description:
          error.message || "An error occurred while sending your feedback.",
      });
    }
  }

  const tabs = [
    {
      title: "Request",
      value: "request",
      content: (
        <Form {...requestForm}>
          <form onSubmit={requestForm.handleSubmit(onRequestSubmit)}>
            <FormField
              control={requestForm.control}
              name="request"
              render={({ field }) => (
                <Card className="py-2 space-y-2">
                  <WavyBackground waveWidth={100} className="mx-auto" />
                  <CardHeader className="pt-1">
                    <CardTitle className="text-xl">
                      Request a Character
                    </CardTitle>
                    <CardDescription>
                      Looking to add someone to the Entropy collection? Share
                      your ideas and we will consider them for future updates.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormItem>
                      <FormControl>
                        <Textarea
                          id="request"
                          placeholder="Could you add Ryan Gosling?"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </CardContent>
                  <CardFooter className="justify-between pt-4">
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        setOpen(false);
                        e.preventDefault();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isRequestSubmitting}
                      type="submit"
                      className="min-w-[100px]"
                    >
                      {isRequestSubmitting ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                      ) : isRequestSuccess ? (
                        <SuccessIcon />
                      ) : (
                        <>
                          Request <ArrowTopRightIcon className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            />
          </form>
        </Form>
      ),
    },
    {
      title: "Feedback",
      value: "feedback",
      content: (
        <Form {...feedbackForm}>
          <form onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)}>
            <FormField
              control={feedbackForm.control}
              name="feedback"
              render={({ field }) => (
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
                    <FormItem>
                      <FormControl>
                        <Textarea
                          id="feedback"
                          placeholder="What if..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </CardContent>
                  <CardFooter className="justify-between pt-4">
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        setOpen(false);
                        e.preventDefault();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button disabled={isFeedbackSubmitting}>
                      {isFeedbackSubmitting ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                      ) : isFeedbackSuccess ? (
                        <SuccessIcon />
                      ) : (
                        <>
                          Send <ArrowTopRightIcon className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            />
          </form>
        </Form>
      ),
    },
  ];

  return (
    <Dialog
      key={"feedback"}
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogContent showCloseIcon={false} className="border-0 w-full">
        <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40">
          <AnimatedTabs key={isRequestSubmitting.toString()} tabs={tabs} />{" "}
        </div>
      </DialogContent>
    </Dialog>
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

  return fetch("https://api.logsnag.com/v1/log", requestOptions)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((json) => {
          throw new Error(json.message || "Network response was not ok");
        });
      }
      return response.text();
    })
    .then((result) => {
      console.log(result);
      return "Success";
    });
}
