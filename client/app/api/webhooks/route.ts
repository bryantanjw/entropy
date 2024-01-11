import { headers } from "next/headers";
import Stripe from "stripe";
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
  creditUserForOneTimePayment,
  creditUserForRecurringPayment,
} from "@/lib/supabase-admin";

import { stripe } from "@/lib/stripe";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("Stripe-Signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          } else if (checkoutSession.mode === "payment") {
            // Call your function to credit the user for a one-time payment
            const lineItems = await stripe.checkout.sessions.listLineItems(
              checkoutSession.id
            );
            await creditUserForOneTimePayment(checkoutSession, lineItems.data);
          }
          break;
        case "invoice.payment_succeeded":
          // Call your function to credit the user for a subscription payment
          const invoice = event.data.object as Stripe.Invoice;
          // TODO: implement creditUserForInitialSubscriptionPayment in case of future plan for promotions and trials
          if (invoice.billing_reason === "subscription_create") {
            await creditUserForRecurringPayment(invoice);
          } else {
            await creditUserForRecurringPayment(invoice);
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400,
        }
      );
    }
  }
  return new Response(JSON.stringify({ received: true }));
}
