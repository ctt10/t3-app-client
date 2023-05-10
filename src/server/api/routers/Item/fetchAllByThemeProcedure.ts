import { publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const fetchAllByThemeProcedure = publicProcedure
  .input(
    z.object({
      theme: z.string(),
    }).nullable() //if empty input, return all
  )
  .query(({ ctx, input }) => {
    if (!input?.theme) throw new TRPCError({ code: 'BAD_REQUEST' });
    if (input?.theme) {
      return ctx.prisma.item.findMany({ where: { theme: input.theme } });
    }
  });

