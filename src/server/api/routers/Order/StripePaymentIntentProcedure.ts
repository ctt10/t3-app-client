import { publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';
import { stripeClient } from "@/server/stripe";
import { type StripePaymentIntent } from "@/types";

//need to take the ids of all items in the cart, 
//use this id to confirm items in database and their status[not sold] && price 
//add price of objects from id, make/return stripe checkout session
export const StripePaymentIntentProcedure = publicProcedure
  .input(
    z.object({
      orderSubTotal: z.number().nullish(),
    })
  ).query(
    async ({ input }): Promise<StripePaymentIntent|null> => {
      if (!input.orderSubTotal) return null;

      //create customer to be used to later identify order returned in webhook response
      const customer = await stripeClient.customers.create();
      
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: input.orderSubTotal,
        currency: "usd",
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        customerId: paymentIntent.customer as string
      }
});