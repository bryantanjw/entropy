"use client";

import { cn } from "@/lib/utils";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Meteors } from "@/components/ui/meteors";
import { Illustration } from "@/components/ui/glowing-stars";
import { useState } from "react";
import { PaymentCard } from "./payment-card";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 ",
        className
      )}
    >
      {children}
    </div>
  );
};

export function SubscriptionGrid({ userDetails }) {
  const [mouseEnterCredits, setMouseEnterCredits] = useState(false);
  const [mouseEnterInvoices, setMouseEnterInvoices] = useState(false);

  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <div
            className={cn(
              "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-md dark:bg-black dark:border-white/[0.1] bg-white border justify-between flex flex-col space-y-2"
            )}
          >
            <div className="flex p-1.5 items-center gap-3 px-5 pt-5 group-hover/bento:translate-x-2 transition duration-200">
              <span className="font-semibold leading-none tracking-wide">
                Plan summary
              </span>
              <Badge variant="secondary" className="w-fit rounded-xl">
                Free Plan
              </Badge>
            </div>
            <div className="grid grid-cols-5 gap-16 p-1.5 pt-0 text-sm items-center px-5 pb-5 group-hover/bento:translate-x-2 transition duration-200">
              <div className="col-span-2 flex flex-col gap-2">
                <div className="font-light text-xs">
                  <span className="font-semibold text-sm">200 </span>
                  <span className="opacity-70">credits left</span>
                </div>
                <Progress className="w-full" value={50} />
              </div>

              <div className="col-span-3 flex gap-10 items-center">
                <div className="flex flex-col font-light gap-1">
                  <span className="text-xs opacity-70">Price/Month</span>
                  <span className="font-semibold">$0</span>
                </div>

                <div className="flex flex-col font-light gap-1">
                  <span className="text-xs opacity-70">Included Credits</span>
                  <span className="font-semibold">200</span>
                </div>

                <div className="flex flex-col font-light gap-1">
                  <span className="text-xs opacity-70">Renewal Date</span>
                  <span className="font-semibold">Feb 1, 2024</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "row-span-1 relative isolate overflow-hidden rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-md p-5 dark:bg-black dark:border-white/[0.1] bg-white border justify-between flex flex-col space-y-2"
            )}
          >
            <div className="flex p-1.5 px-0 group-hover/bento:translate-x-2 transition duration-200">
              <span className="font-semibold leading-none tracking-wide">
                Payment method
              </span>
            </div>
            <div className="p-1.5 pt-0 text-sm px-0 group-hover/bento:translate-x-2 transition duration-200">
              <div className="font-light text-sm">No payment method added.</div>
            </div>
            <div className="absolute -right-36 top-7 h-full max-w-none group-hover/bento:-translate-y-2 transition duration-200">
              <PaymentCard userDetails={userDetails} />
            </div>
          </div>

          <div
            className={cn(
              "relative overflow-hidden row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-md p-5 dark:bg-black dark:border-white/[0.1] bg-white border justify-between flex flex-col space-y-2"
            )}
            onMouseEnter={() => {
              setMouseEnterInvoices(true);
            }}
            onMouseLeave={() => {
              setMouseEnterInvoices(false);
            }}
          >
            <div className="flex p-1.5 px-0 group-hover/bento:translate-x-2 transition duration-200">
              <CardTitle>Invoices</CardTitle>
            </div>
            <div className="flex flex-col px-0 p-1.5 pt-0 text-sm gap-2 group-hover/bento:translate-x-2 transition duration-200">
              <p>
                You can refer to all your past invoices in your Stripe portal,
                under Invoices.
              </p>
              <Link className="text-blue-600 hover:underline w-fit" href="#">
                Go to the Invoices page <sup>&#8599;</sup>
              </Link>
            </div>

            <Meteors number={20} mouseEnter={mouseEnterInvoices} />
          </div>
        </div>

        <div
          className={cn(
            "lg:col-span-2",
            "row-span-1 flex flex-col rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-md px-3 py-5 dark:bg-black dark:border-white/[0.1] bg-white border space-y-2"
          )}
          onMouseEnter={() => {
            setMouseEnterCredits(true);
          }}
          onMouseLeave={() => {
            setMouseEnterCredits(false);
          }}
        >
          <Illustration mouseEnter={mouseEnterCredits} />
          <div className="flex p-1.5 px-4 pt-3">
            <span className="font-semibold leading-none tracking-wide">
              On-Demand Credits
            </span>
          </div>
          <div className="p-1.5 pt-0 text-sm font-light px-4 space-y-4">
            <p className="opacity-70">
              You cannot buy on-demand credits without an active subscription.
              Please resume your subscription or choose a new plan.
            </p>

            <Select>
              <SelectTrigger id="credits">
                <SelectValue placeholder="Select credits" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="50">30 Credits</SelectItem>
                <SelectItem value="100">80 Credits</SelectItem>
                <SelectItem value="200">200 Credits</SelectItem>
              </SelectContent>
            </Select>

            {/* Only show balance summary when credits are selected */}
            {/* <div className="mt-6 p-4 rounded-lg border">
              <div className="font-medium">Credits Balance Summary</div>
              <div className="mt-6">
                <div className="flex justify-between">
                  <span>Current Credits Balance</span>
                  <div>200</div>
                </div>
              </div>
              <Row className="my-3 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
              <div>
                <div className="flex justify-between">
                  <span>On-Demand Credits</span>
                </div>
              </div>
              <Row className="my-3 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

              <div>
                <div className="flex justify-between">
                  <span>New Credits Balance After Purchase</span>
                  <div>200</div>
                </div>
              </div>
            </div> */}
          </div>

          <CardFooter className="px-4">
            <Button className="w-full">Purchase Credits</Button>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}
