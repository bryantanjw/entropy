import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Illustration } from "@/components/ui/glowing-stars";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStripe, postData } from "@/lib/stripe-client";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";

export const CreditsGrid = ({ userCredits, products, subscription }) => {
  const [mouseEnter, setMouseEnter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCreditPackage, setSelectedCreditPackage] = useState(null);

  // Filter to include only non-recurring (one-time purchase) products
  const nonRecurringProducts = products.filter(
    (product) =>
      product.prices.length === 1 && product.prices[0].type === "one_time"
  );

  const handleCheckout = async (product) => {
    setIsLoading(true);

    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price: product.prices[0] },
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

  return (
    <div
      className={cn(
        "lg:col-span-2",
        "row-span-1 flex flex-col rounded-lg group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-md px-3 pt-5 dark:bg-black dark:border-white/[0.1] bg-white border space-y-2"
      )}
      onMouseEnter={() => {
        setMouseEnter(true);
      }}
      onMouseLeave={() => {
        setMouseEnter(false);
      }}
    >
      <Illustration mouseEnter={mouseEnter} />
      <div className="flex p-1.5 px-4 pt-3">
        <span className="font-semibold leading-none tracking-wide">
          On-Demand Credits
        </span>
      </div>
      <div className="p-1.5 pt-0 text-sm font-light px-4 space-y-4">
        <p className="opacity-70">
          You cannot buy on-demand credits without an active subscription.
        </p>
        <Select
          disabled={!subscription}
          value={selectedCreditPackage?.id}
          onValueChange={(value) => {
            setSelectedCreditPackage(
              nonRecurringProducts.find((product) => product.id === value)
            );
          }}
        >
          <SelectTrigger id="credits">
            <SelectValue placeholder="Select credits" />
          </SelectTrigger>
          <SelectContent position="popper">
            {nonRecurringProducts.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          className={`mt-6 p-4 rounded-lg border bg-muted ${
            !subscription ? "opacity-60" : "opacity-100"
          }`}
        >
          <div className="font-medium">Credits Balance Summary</div>
          <div className="mt-3">
            <div className="flex justify-between">
              <span>Current Credits Balance</span>
              <div>{userCredits}</div>
            </div>
          </div>
          <Separator className="my-2.5" />
          <div>
            <div className="flex justify-between">
              <span>On-Demand Credits</span>
              <div>{selectedCreditPackage?.metadata.credits}</div>
            </div>
          </div>
          <Separator className="my-2.5" />

          <div>
            <div className="flex justify-between">
              <span>New Credits Balance After Purchase</span>
              <div>
                {selectedCreditPackage
                  ? parseInt(selectedCreditPackage?.metadata["credits"]) +
                    userCredits
                  : userCredits}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardFooter className="px-4">
        <Button
          disabled={!subscription || !selectedCreditPackage}
          onClick={() => handleCheckout(selectedCreditPackage)}
          className="w-full"
        >
          {isLoading ? (
            <Icons.spinner className="animate-spin" />
          ) : (
            "Purchase Credits"
          )}
        </Button>
      </CardFooter>
    </div>
  );
};
