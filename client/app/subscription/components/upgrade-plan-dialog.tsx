"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
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
import { useRouter } from "next/navigation";
import { Price, Product } from "./subscription-grid";
import { toast } from "sonner";
import { getStripe } from "@/lib/stripe-client";
import { Icons } from "@/components/ui/icons";

export function UpgradePlanDialog({ user, products }) {
  const router = useRouter();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const redirectToCustomerPortal = async (price) => {
    setIsLoading(true);
    try {
      const { url } = await postData({
        url: "/api/create-portal-link",
      });
      router.push(url);
    } catch (error) {
      toast.error("Couldn't access customer protal link.", {
        description: error.message ?? `Please try again`,
      });
    }
    setIsLoading(false);
  };

  const handleCheckout = async (price: Price) => {
    setIsLoading(true);
    if (!user) {
      return router.push("/signin");
    }

    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error("Something went wrong with your checkout", {
        description: (error as Error)?.message ?? "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <Tabs defaultValue={products[1].id} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                {products.map((product) => (
                  <TabsTrigger key={product.id} value={product.id}>
                    {product.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {products.map((product) => (
                <TabsContent key={product.id} value={product.id}>
                  <PlanTabs
                    product={product}
                    isAnnual={isAnnual}
                    setIsAnnual={setIsAnnual}
                    setSelectedPrice={setSelectedPrice}
                    theme={theme}
                  />
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
              className="bg-white h-10 dark:bg-transparent border"
              onClick={toggleDialog}
            >
              Cancel
            </Button>
            <Button
              className="h-10 min-w-[120px]"
              onClick={() => handleCheckout(selectedPrice)}
            >
              <div className="w-full absolute inset-0 h-full">
                <SparklesCore
                  id="tsparticlesfullpage"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.4}
                  particleDensity={25}
                  className="w-full h-full"
                  particleColor={theme === "dark" ? "#000" : "#fff"}
                />
              </div>
              {isLoading ? (
                <Icons.spinner className="w-4 h-4 animate-spin" />
              ) : (
                "Confirm and Pay"
              )}
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

const PlanTabs = ({
  product,
  isAnnual,
  setIsAnnual,
  setSelectedPrice,
  theme,
}) => {
  setSelectedPrice(
    isAnnual
      ? product.prices.find((p) => p.interval === "year")
      : product.prices.find((p) => p.interval === "month")
  );
  // Find the correct price based on the isAnnual flag
  const price = product.prices.find(
    (p) => p.interval === (isAnnual ? "year" : "month")
  );

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-600 rounded-lg border text-left">
      <div className="flex justify-between p-5 mb-1">
        <AnimatePresence mode="wait">
          <div className="relative inline-flex gap-3">
            <motion.span
              key={isAnnual ? "annually" : "monthly"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-semibold"
            >
              $
              {isAnnual
                ? price.unit_amount / 100 / 12
                : price.unit_amount / 100}
              {/* Adjusted to display in dollars */}
            </motion.span>
            <div className="flex flex-col text-sm tracking-wide">
              <span className="text-sm font-light">/ month</span>
              <motion.div
                key={isAnnual ? "annually" : "monthly"}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <span className="opacity-60">
                  Billed {isAnnual ? "annually" : "monthly"}
                </span>
                {isAnnual ? (
                  <motion.div className="absolute -bottom-[1px] right-3 h-[1px]">
                    <svg width="37" height="8" viewBox="0 0 37 8" fill="none">
                      <motion.path
                        d="M1 5.39971C7.48565 -1.08593 6.44837 -0.12827 8.33643 6.47992C8.34809 6.52075 11.6019 2.72875 12.3422 2.33912C13.8991 1.5197 16.6594 2.96924 18.3734 2.96924C21.665 2.96924 23.1972 1.69759 26.745 2.78921C29.7551 3.71539 32.6954 3.7794 35.8368 3.7794"
                        stroke={theme === "light" ? "#000" : "#fff"}
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{
                          strokeDasharray: 84.20591735839844,
                          strokeDashoffset: 84.20591735839844,
                        }}
                        animate={{
                          strokeDashoffset: 0,
                        }}
                        transition={{
                          duration: 1,
                        }}
                      />
                    </svg>
                  </motion.div>
                ) : null}
              </motion.div>
            </div>
          </div>
        </AnimatePresence>
        <Switch
          isAnnual={isAnnual}
          setIsAnnual={setIsAnnual}
          product={product}
          setSelectedPrice={setSelectedPrice}
        />
      </div>

      <div className="min-h-[165px] p-4 bg-muted rounded-b-lg">
        <ul className="space-y-4">
          {product.features.map((feature, index) => (
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
              <span className="ml-2 opacity-80 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Switch = ({
  isAnnual,
  setIsAnnual,
  product,
  setSelectedPrice,
}: {
  isAnnual: boolean;
  setIsAnnual: (isAnnual: boolean) => void;
  product: any;
  setSelectedPrice: (price: Price) => void;
}) => {
  return (
    <form className="flex space-x-4  antialiased">
      <label
        htmlFor="checkbox"
        className={twMerge(
          "h-6  px-1  flex items-center bg-opacity-100 dark:bg-opacity-50 backdrop-blur-md border border-white border-opacity-10 shadow-[inset_0px_0px_14px_rgba(0,0,0,0.25)] rounded-full w-[40px] relative cursor-pointer transition duration-200",
          isAnnual
            ? "bg-slate-900 dark:bg-slate-800"
            : "bg-slate-100 dark:bg-slate-500"
        )}
      >
        <motion.div
          initial={{
            width: "20px",
            x: isAnnual ? 0 : 17,
          }}
          animate={{
            height: ["14px", "6px", "14px"],
            width: ["14px", "20px", "14px", "14px"],
            x: isAnnual ? 17 : 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.1,
          }}
          key={String(isAnnual)}
          className={twMerge(
            "h-[20px] block rounded-full bg-gradient-to-b from-white to-blue-100 shadow-md z-10"
          )}
        ></motion.div>
        <input
          type="checkbox"
          checked={isAnnual}
          onChange={(e) => {
            const newIsAnnual = e.target.checked;
            setIsAnnual(newIsAnnual);
            console.log("isAnnual", newIsAnnual);
            setSelectedPrice(
              newIsAnnual
                ? product.prices.find((p) => p.interval === "year")
                : product.prices.find((p) => p.interval === "month")
            );
          }}
          className="hidden"
          id="checkbox"
        />
      </label>
    </form>
  );
};

const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log("posting,", url, data);

  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("Error in postData", { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};
