import {
  getActiveProductsWithPrices,
  getSession,
  getSubscription,
  getUserDetails,
} from "@/lib/supabase-server";
import Navbar from "@/components/navbar";
import { Column } from "@/components/ui/column";
import { Row } from "@/components/ui/row";
import { SubscriptionGrid } from "./components/subscription-grid";
import { BoxesContainer } from "@/components/ui/interactive-bg-boxes";
import Footer from "@/components/footer";

export default async function SubscriptionPage() {
  const [session, userDetails, products, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getActiveProductsWithPrices(),
    getSubscription(),
  ]);
  const user = session?.user;

  return (
    <div>
      <Navbar />

      <Column className="w-full items-center min-h-screen py-18 px-4">
        <Column className="w-full max-w-4xl xl:max-w-7xl">
          <div className="relative w-full overflow-hidden bg-background flex flex-col justify-start rounded-lg pt-32 pb-14">
            <div
              className="absolute inset-0 w-full h-full bg-background z-20 pointer-events-none"
              style={{
                maskImage:
                  "radial-gradient(circle at center, transparent, white)",
              }}
            />
            <BoxesContainer />
            <h1
              className={
                "w-fit md:text-4xl text-xl font-semibold relative z-20"
              }
            >
              Subscription & Billing
            </h1>
            <p className="w-fit text-muted-foreground font-light mt-2 relative z-20 tracking-wide">
              {user?.email}
            </p>
          </div>

          <Row className="mb-14 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

          <SubscriptionGrid
            userDetails={userDetails}
            products={products}
            subscription={subscription}
          />
        </Column>
      </Column>

      <Footer />
    </div>
  );
}
