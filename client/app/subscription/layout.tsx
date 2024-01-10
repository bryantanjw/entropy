import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Session } from "@supabase/supabase-js";

import { Separator } from "@/components/ui/separator";

import { getSession, getUserDetails } from "../supabase-server";
import Navbar from "@/components/navbar";
import { Column } from "@/components/ui/column";
import { SubscriptionBentoGrid } from "./components/bento-grid";
import { Row } from "@/components/ui/row";

export const metadata: Metadata = {
  title: "Entropy | Your Account",
  description: "Manage your subscription.",
};

interface SubscriptionLayoutProps {
  children: React.ReactNode;
}

export default async function SubscriptionLayout({
  children,
}: SubscriptionLayoutProps) {
  const [session, userDetails] = await Promise.all([
    getSession(),
    getUserDetails(),
  ]);

  const user = session?.user;
  if (!session) {
    return redirect("/signin");
  }

  return (
    <div className="max-w-7xl w-full mx-auto flex flex-col items-center">
      <Navbar user={user} userDetails={userDetails} />
      <Column className="w-full items-center min-h-screen py-32">
        <Column className="w-full max-w-3xl lg:max-w-4xl xl:max-w-6xl">
          <div className="space-y-0.5">
            <h2 className="text-3xl font-semibold tracking-tight">
              Subscription & Billing
            </h2>
            <p className="text-muted-foreground">bryantanjw01@gmail.com</p>
          </div>
          <Row className="my-14 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
          <SubscriptionBentoGrid />
        </Column>
      </Column>
    </div>
  );
}
