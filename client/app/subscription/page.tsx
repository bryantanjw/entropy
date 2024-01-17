import { getUserDetails } from "@/lib/supabase-server";
import Navbar from "@/components/navbar";
import { Column } from "@/components/ui/column";
import { Row } from "@/components/ui/row";
import { SubscriptionGrid } from "./components/subscription-grid";

export default function SettingsBillingPage() {
  const userDetails = getUserDetails();

  return (
    <div>
      <Navbar />
      <Column className="w-full items-center min-h-screen py-32">
        <Column className="w-full max-w-3xl lg:max-w-4xl xl:max-w-6xl">
          <div className="space-y-0.5">
            <h2 className="text-3xl font-semibold tracking-tight">
              Subscription & Billing
            </h2>
            <p className="text-muted-foreground">bryantanjw01@gmail.com</p>
          </div>
          <Row className="my-14 w-full h-[1px] bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent" />
          <SubscriptionGrid userDetails={userDetails} />
        </Column>
      </Column>
    </div>
  );
}
