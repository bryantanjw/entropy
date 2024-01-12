// @ts-nocheck
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { BrandStatement } from "@/components/ui/brand-statement";
import { stripe } from "@/utils/stripe";

export const metadata: Metadata = {
  title: "Entropy | Order Successful!",
  description: "Payment was made successfully.",
};

type SuccessPageProps = {
  params: {
    sessionId: string;
  };
};

export default async function SuccessPage({ params }: SuccessPageProps) {
  const session = await stripe.checkout.sessions.retrieve(params.sessionId);
  const customer = await stripe.customers.retrieve(session.customer);

  return (
    <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <BrandStatement />
      <div className="lg:p-8 flex justify-center items-center h-screen">
        <div className="lg:p-8 flex justify-center items-center h-screen relative text-center -mt-12">
          {!customer ? (
            <Icons.spinner className="w-5 h-5 animate-spin" />
          ) : (
            <div className="mx-auto flex flex-col">
              <div className="mb-9 space-y-2">
                <h1 className="text-2xl">Thanks for your order,</h1>
                <h2 className="text-xl font-semibold">
                  {customer.name ?? customer.email}
                </h2>
              </div>

              <Link href={"/"}>
                <Button className="mx-auto items-center justify-center gap-x-2 mb-5">
                  <Image
                    className="filter invert dark:filter-none lg:-ml-1"
                    width={18}
                    height={18}
                    src={"/sparkling-icon.png"}
                    alt={"Generate"}
                  />
                  <span>Start Generating</span>
                </Button>
              </Link>
              <p className="px-8 text-center text-sm text-muted-foreground w-full">
                or continue to{" "}
                <Link
                  href="/account"
                  className="underline underline-offset-2 hover:text-muted-foreground text-black cursor-pointer"
                >
                  view your account
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
