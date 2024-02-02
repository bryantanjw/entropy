"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
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
import { SparklesCore } from "@/components/ui/sparkles";
import Link from "next/link";

export function UpgradePlanDialog() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  function toggleDialog() {
    setOpen(!open);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button>Upgrade</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[480px] border-none"
        showCloseIcon={false}
      >
        <Card className="justify-center text-center p-4 px-0 pb-0">
          <CardHeader className="px-8 pt-4">
            <CardTitle className="text-2xl">
              You&apos;re currently on the Free plan
            </CardTitle>
            <CardDescription>
              Choose from the plan options below.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <Tabs defaultValue="standard" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                {Object.keys(plans).map((planKey) => (
                  <TabsTrigger key={planKey} value={planKey}>
                    {planKey.charAt(0).toUpperCase() + planKey.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.keys(plans).map((planKey) => (
                <TabsContent key={planKey} value={planKey}>
                  <PlanTabs value={planKey} />
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex opacity-80 text-start pt-5 text-sm gap-1">
              <p>Or check all plans in our</p>
              <Link className="text-blue-600 hover:underline w-fit" href="#">
                Pricing Page <sup>&#8599;</sup>
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between py-4 bg-muted rounded-b-xl border-t">
            <Button
              variant="secondary"
              className="bg-white h-10 dark:bg-gray-800 border"
              onClick={toggleDialog}
            >
              Cancel
            </Button>
            <Button className="h-10">
              <div className="w-full absolute inset-0 h-full">
                <SparklesCore
                  id="tsparticlesfullpage"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.4}
                  particleDensity={30}
                  className="w-full h-full"
                  particleColor={theme === "dark" ? "#000" : "#fff"}
                />
              </div>
              Confirm and Pay
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

const PlanTabs = ({ value }: { value: string }) => {
  const [checked, setChecked] = useState(false);
  const plan = plans[value];

  if (!plan) return null;

  return (
    <div className="divide-y divide-gray-200 rounded-lg border text-left">
      <div className="flex p-4 gap-2 justify-between">
        <p>
          <strong className="text-3xl font-semibold text-gray-900">
            ${plan.prices.monthly}
          </strong>
          <span className="text-sm font-light opacity-60">/ month</span>
        </p>
        <Switch checked={checked} setChecked={setChecked} />
      </div>

      <div className="min-h-[165px] p-4 bg-muted">
        <ul className="space-y-4">
          {plan.items.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-circle-check-filled h-5 w-5"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#fff"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
                  strokeWidth="0"
                  fill="#57F0D4"
                />
              </svg>
              <span className="ml-2 opacity-80 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const plans = {
  basic: {
    prices: {
      monthly: 10,
      yearly: 8,
    },
    items: [
      "800 Credits/month (~240 images)",
      "General Commercial Terms",
      "Optional credit purchase",
    ],
  },
  standard: {
    prices: {
      monthly: 30,
      yearly: 24,
    },
    items: [
      "5000 Credits/month (~1,500 images)",
      "General Commercial Terms",
      "Optional credit purchase",
      "Character requests",
    ],
  },
  pro: {
    prices: {
      monthly: 60,
      yearly: 48,
    },
    items: [
      "12,000 Credits/month (~3,600 images)",
      "General Commercial Terms",
      "Optional credit purchase",
      "Character requests",
    ],
  },
};

export const Switch = ({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: (checked: boolean) => void;
}) => {
  return (
    <form className="flex space-x-4  antialiased">
      <label
        htmlFor="checkbox"
        className={twMerge(
          "h-7  px-1  flex items-center border border-transparent shadow-[inset_0px_0px_12px_rgba(0,0,0,0.25)] rounded-full w-[60px] relative cursor-pointer transition duration-200",
          checked ? "bg-cyan-500" : "bg-slate-700 border-slate-500"
        )}
      >
        <motion.div
          initial={{
            width: "20px",
            x: checked ? 0 : 32,
          }}
          animate={{
            height: ["20px", "10px", "20px"],
            width: ["20px", "30px", "20px", "20px"],
            x: checked ? 32 : 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.1,
          }}
          key={String(checked)}
          className={twMerge(
            "h-[20px] block rounded-full bg-white shadow-md z-10"
          )}
        ></motion.div>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="hidden"
          id="checkbox"
        />
      </label>
    </form>
  );
};
