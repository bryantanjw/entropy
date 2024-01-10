import { Separator } from "@/components/ui/separator";
import {
  getSession,
  getSubscription,
  getUserDetails,
} from "@/app/supabase-server";

export default async function SettingsBillingPage() {
  const [session, userDetails, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscription(),
  ]);

  return <div className="space-y-6 h-[800px]"></div>;
}
