import { publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const fetchAllByTypeProcedure = publicProcedure
  .input(
    z.object({
      itemType: z.enum(['Macrame', 'Gemstone']),
    }).nullable() //if empty input, return all
  )
  .query(({ ctx, input }) => {
    if (!input?.itemType) throw new TRPCError({ code: 'BAD_REQUEST' });
    if (!!input?.itemType) {
      return ctx.prisma.item.findMany({ 
        where: { itemType: input.itemType },
        select: {
          id: true,
          name: true,
          theme: true,
          media: true,
          price: true,
          itemType: true,
          subType: true,
          quantity: true,
          description: true,
        },
      });
    }
  });

