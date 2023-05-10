import { createTRPCRouter } from "@/server/api/trpc";
import { StripePaymentIntentProcedure, createOrderProcedure } from "@/server/api/routers/Order";

export const orderRouter = createTRPCRouter({
  StripePaymentIntent: StripePaymentIntentProcedure,
  create: createOrderProcedure,
});

export default orderRouter;

