import { publicProcedure } from '@/server/api/trpc';
// import { type IGalleryItem } from '@/types';
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
    });

