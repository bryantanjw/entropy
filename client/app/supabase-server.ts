import { Database } from "@/types_db";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";

export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
});

export async function getSession() {
  const supabase = createServerSupabaseClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getUserDetails() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: userDetails } = await supabase
      .from("users")
      .select("*")
      .single();
    return userDetails;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getSubscription() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .maybeSingle()
      .throwOnError();
    return subscription;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export const getActiveProductsWithPrices = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("id");

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export async function getGenerationCount() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: generation, error } = await supabase
      .from("generations")
      .select("count")
      .single();

    if (error) {
      console.error("Supabase error:", error);
    }

    return generation ? generation.count : null;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
