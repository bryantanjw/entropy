import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

import { toDateTime } from "./helpers";
import { stripe } from "./stripe";
import type { Database } from "@/types_db";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Price = Database["public"]["Tables"]["prices"]["Row"];

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  console.log("upsertProductRecord");
  const { error } = await supabaseAdmin.from("products").upsert([productData]);
  if (error) throw error;
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  };

  const { error } = await supabaseAdmin.from("prices").upsert([priceData]);
  if (error) throw error;
  console.log(`Price inserted/updated: ${price.id}`);
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", uuid)
    .single();
  if (error || !data?.stripe_customer_id) {
    // No customer record found, let's create one.
    const customerData: { metadata: { supabaseUUID: string }; email?: string } =
      {
        metadata: {
          supabaseUUID: uuid,
        },
      };
    if (email) customerData.email = email;
    const customer = await stripe.customers.create(customerData);
    // Now insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await supabaseAdmin
      .from("customers")
      .insert([{ id: uuid, stripe_customer_id: customer.id }]);
    if (supabaseError) throw supabaseError;
    console.log(`New customer created and inserted for ${uuid}.`);
    return customer.id;
  }
  return data.stripe_customer_id;
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", uuid);
  if (error) throw error;
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  if (noCustomerError) throw noCustomerError;

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"] =
    {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      status:
        subscription.status as Database["public"]["Enums"]["subscription_status"],
      price_id: subscription.items.data[0].price.id,
      //TODO check quantity on subscription
      // @ts-ignore
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? toDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: toDateTime(
        subscription.current_period_start
      ).toISOString(),
      current_period_end: toDateTime(
        subscription.current_period_end
      ).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? toDateTime(subscription.trial_end).toISOString()
        : null,
    };

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData]);
  if (error) throw error;
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};

const creditUserForOneTimePayment = async (
  checkoutSession: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[]
) => {
  // Get the Stripe customer ID from the Checkout session
  const stripeCustomerId = checkoutSession.customer;

  // Get the user ID from the customers table
  const { data: customer, error: getCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", stripeCustomerId)
    .single();

  if (getCustomerError || !customer) {
    console.error("Error getting customer:", getCustomerError);
    return;
  }

  const userId = customer.id;
  const priceId = lineItems[0].price.id;
  const price = await stripe.prices.retrieve(priceId);
  // Get the number of credits from the Price metadata
  const creditsToAdd = parseInt(price.metadata.credits);

  const { data: user, error: getUserError } = await supabaseAdmin
    .from("users")
    .select("credits")
    .eq("id", userId)
    .single();

  if (getUserError) {
    console.error("Error getting user:", getUserError);
    return new Response(
      JSON.stringify({
        error: {
          statusCode: 500,
          message:
            "An error occurred while updating your credits. If your account wasn't properly credited, please contact support @.",
        },
      }),
      { status: 500 }
    );
  }

  // Update the user's credits
  const newCredits = (user?.credits || 0) + creditsToAdd;
  const { error: updateUserError } = await supabaseAdmin
    .from("users")
    .update({ credits: newCredits })
    .eq("id", userId);

  if (updateUserError) {
    console.error("Error updating user credits:", updateUserError);
    return new Response(
      JSON.stringify({
        error: {
          statusCode: 500,
          message:
            "An error occurred while updating your credits. If your account wasn't properly credited, please contact support @.",
        },
      }),
      { status: 500 }
    );
  }
};

const creditUserForRecurringPayment = async (invoice: Stripe.Invoice) => {
  // Get the Stripe customer ID from the invoice
  const stripeCustomerId = invoice.customer;

  // Get the user ID from the customers table
  const { data: customer, error: getCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", stripeCustomerId)
    .single();

  if (getCustomerError || !customer) {
    console.error("Error getting customer:", getCustomerError);
    return;
  }
  const userId = customer.id;
  const priceId = invoice.lines.data[0].price.id;
  const price = await stripe.prices.retrieve(priceId);
  // Get the number of credits from the Price metadata
  const creditsToAdd = parseInt(price.metadata.credits);

  const { data: user, error: getUserError } = await supabaseAdmin
    .from("users")
    .select("credits")
    .eq("id", userId)
    .single();

  if (getUserError) {
    console.error("Error getting user:", getUserError);
    return new Response(
      JSON.stringify({
        error: {
          statusCode: 500,
          message:
            "An error occurred while fetching your account. If your account wasn't properly credited, please contact support @.",
        },
      }),
      { status: 500 }
    );
  }

  // Update the user's credits
  const newCredits = (user?.credits || 0) + creditsToAdd;
  const { error: updateUserError } = await supabaseAdmin
    .from("users")
    .update({ credits: newCredits })
    .eq("id", userId);

  if (updateUserError) {
    console.error("Error updating user credits:", updateUserError);
    return new Response(
      JSON.stringify({
        error: {
          statusCode: 500,
          message:
            "An error occurred while updating your credits. If your account wasn't properly credited, please contact support @.",
        },
      }),
      { status: 500 }
    );
  }
};

const deductCredits = async (userId: string, creditsToDeduct: number) => {
  const { data: user, error: getUserError } = await supabaseAdmin
    .from("users")
    .select("credits")
    .eq("id", userId)
    .single();

  if (getUserError) {
    console.error("Error getting user:", getUserError);
    return new Response(
      JSON.stringify({
        error: {
          statusCode: 500,
          message: "Error getting user",
        },
      }),
      { status: 500 }
    );
  }

  // Update the user's credits
  const newCredits = (user?.credits || 0) - creditsToDeduct;
  const { error: updateUserError } = await supabaseAdmin
    .from("users")
    .update({ credits: newCredits })
    .eq("id", userId);

  if (updateUserError) {
    console.error("Error deducting user credits:", updateUserError);
    return new Response(
      JSON.stringify({
        error: {
          statusCode: 500,
          message: "Error deducting user credits",
        },
      }),
      { status: 500 }
    );
  }
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  creditUserForOneTimePayment,
  creditUserForRecurringPayment,
  deductCredits,
};
