import { createTRPCRouter } from "@/server/api/trpc";
import { itemRouter } from "@/server/api/routers/itemRouter";
import { orderRouter } from "@/server/api/routers/orderRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  item: itemRouter,
  order: orderRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type ItemRouter = typeof itemRouter;
export type OrderRouter = typeof orderRouter;
