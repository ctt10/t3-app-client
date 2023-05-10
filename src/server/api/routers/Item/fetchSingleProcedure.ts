import { publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const fetchSingleProcedure = publicProcedure
  .input(
    z.object({
      itemId: z.string(),
    }) //if empty input, return all
  )
  .query( ({ ctx, input }) => {
    
    console.log('fetchSingle input =============', input);

      if(!input.itemId) throw new TRPCError({ code: 'BAD_REQUEST' });
      return ctx.prisma.item.findUnique({
        where: { id: input.itemId },
      });
    });

