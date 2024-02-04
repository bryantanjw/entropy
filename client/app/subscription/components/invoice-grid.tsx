import React from "react";
import { CardTitle } from "@/components/ui/card";
import { Meteors } from "@/components/ui/meteors";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const InvoiceGrid = () => {
  const [mouseEnter, setMouseEnter] = React.useState(false);
  return (
    <div
      className={cn(
        "relative overflow-hidden row-span-1 rounded-lg group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-md p-5 dark:bg-black dark:border-white/[0.1] bg-white border justify-between flex flex-col space-y-2"
      )}
      onMouseEnter={() => {
        setMouseEnter(true);
      }}
      onMouseLeave={() => {
        setMouseEnter(false);
      }}
    >
      <div className="flex p-1.5 px-0 group-hover/bento:translate-x-2 transition duration-200">
        <CardTitle>Invoices</CardTitle>
      </div>
      <div className="flex flex-col px-0 p-1.5 pt-0 text-sm gap-1.5 group-hover/bento:translate-x-2 transition duration-200">
        <p>
          You can refer to all your past invoices in your Stripe portal, under
          Invoices.
        </p>
        <Link className="text-blue-600 hover:underline w-fit" href="#">
          Go to the Invoices page <sup>&#8599;</sup>
        </Link>
      </div>

      <Meteors number={20} mouseEnter={mouseEnter} />
    </div>
  );
};
