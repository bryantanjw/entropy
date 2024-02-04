"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PaymentCard } from "./payment-card";
import { UpgradePlanDialog } from "./upgrade-plan-dialog";

import { InvoiceGrid } from "./invoice-grid";
import { CreditsGrid } from "./optional-credits-grid";

import { Database } from "@/types_db";

export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Price = Database["public"]["Tables"]["prices"]["Row"];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface PricingProps {
  userDetails: any;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

export function SubscriptionGrid({
  userDetails,
  products,
  subscription,
}: PricingProps) {
  const { credits } = userDetails;
  const renewal = new Date(
    subscription?.cancel_at || subscription?.current_period_end
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const pricingCredits = subscription?.prices.products.metadata["credits"];

  return (
    <div className="mx-auto z-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <div
            className={cn(
              "row-span-1 rounded-lg group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-md dark:bg-black dark:border-white/[0.1] bg-white border justify-between flex flex-col space-y-2"
            )}
          >
            <div className="flex p-1.5 items-center gap-3 px-5 pt-5 group-hover/bento:translate-x-2 transition duration-200">
              <span className="font-semibold leading-none tracking-wide">
                Plan summary
              </span>
              <Badge variant="secondary" className="w-fit rounded-xl">
                {subscription?.prices?.products?.name ?? "Free"} Plan
              </Badge>
            </div>
            <div className="grid grid-cols-5 gap-16 p-1.5 pt-0 text-sm items-center px-5 pb-5 group-hover/bento:translate-x-2 transition duration-200">
              <div className="col-span-2 flex flex-col gap-2">
                <div className="font-light text-xs gap-1">
                  <span className="font-semibold text-sm">{credits}</span>
                  <span className="opacity-70"> credits left</span>
                </div>
                <Progress
                  className="w-full"
                  value={(credits / pricingCredits) * 100}
                />
              </div>

              <div className="col-span-3 flex gap-10 items-center">
                <div className="flex flex-col font-light gap-1">
                  <span className="text-xs opacity-70">Price/Month</span>
                  <span className="font-semibold">
                    $
                    {subscription
                      ? `${subscription.prices.unit_amount / 100}`
                      : "0"}
                  </span>
                </div>

                <div className="flex flex-col font-light gap-1">
                  <span className="text-xs opacity-70">Included Credits</span>
                  <span className="font-semibold">
                    {subscription ? `${pricingCredits}` : "0"}
                  </span>
                </div>

                <div className="flex flex-col font-light gap-1">
                  <span className="text-xs opacity-70">Renewal Date</span>
                  <span className="font-semibold">
                    {subscription ? renewal : "No active plan"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex px-5 py-2.5 bg-muted justify-end rounded-b-lg border-t">
              <UpgradePlanDialog
                subscription={subscription}
                products={products}
              />
            </div>
          </div>

          <div
            className={cn(
              "row-span-1 relative isolate overflow-hidden rounded-lg group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-md p-5 dark:bg-black dark:border-white/[0.1] bg-white border justify-between flex flex-col space-y-2"
            )}
          >
            <div className="flex p-1.5 px-0 group-hover/bento:translate-x-2 transition duration-200">
              <span className="font-semibold leading-none tracking-wide">
                Payment method
              </span>
            </div>
            <div className="p-1.5 pt-0 text-sm px-0 group-hover/bento:translate-x-2 transition duration-200">
              <div className="font-light text-sm">
                No payment method added
                {/* {subscription
                  ? subscription?.card_brand.charAt(0).toUpperCase() +
                    subscription?.card_brand.slice(1) +
                    " " +
                    "••••" +
                    " " +
                    subscription.card_last4
                  : "No payment method added."} */}
              </div>
            </div>
            <div className="absolute -right-36 top-7 h-full max-w-none group-hover/bento:-translate-y-4 transition duration-200">
              <PaymentCard subscription={subscription} />
            </div>
          </div>

          <InvoiceGrid />
        </div>

        <CreditsGrid
          userCredits={credits}
          products={products}
          subscription={subscription}
        />
      </div>
    </div>
  );
}
