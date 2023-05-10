import { createTRPCRouter } from "@/server/api/trpc";
import { fetchAllByTypeProcedure } from "@/server/api/routers/Item";
import { fetchAllByThemeProcedure } from "@/server/api/routers/Item";
import { fetchSingleProcedure } from "@/server/api/routers/Item";

export const itemRouter = createTRPCRouter({
  fetchByType: fetchAllByTypeProcedure,
  fetchByTheme: fetchAllByThemeProcedure,
  fetchSingle: fetchSingleProcedure,
});

export default itemRouter;

// export type definition of API
export type ItemRouter = typeof itemRouter;