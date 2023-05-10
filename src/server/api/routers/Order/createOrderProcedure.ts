import { publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';
import { type PrismaItemId } from '@/types';
import { TRPCError } from '@trpc/server';
import {type Order} from "@prisma/client"
/**
 * This procedure is called after reception of 
 *   webhook type:success from stripe.
 * An order object is created in Prisma DB before
 *   triggering a call to quickbooks to create bill
 * 
 * All orders created have a default payment status of "pending"
 *  this is later updated upon webhook reception from Stripe
 * 
 * //Ids of items are used to get item info && price of items
 */
export const createOrderProcedure = publicProcedure
  .input(
    z.object({
      shippingInfo: z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        country: z.string(),
        stateProvince: z.string(),
        city: z.string(),
        addressOne: z.string(),
        addressTwo: z.string(),
        zipCode: z.string(),
        phoneNumber: z.string(),
      }),
      items: z.object({
        item: z.object({
          id: z.string(),
          name: z.string(),
          media: z.array(z.string()),
          price: z.number(),
          quantity: z.number(),
          theme: z.string(),
          itemType: z.string(),
          subType: z.string(),
          description: z.string(),
          createdAt: z.string().datetime()
        }).nullish(), //item may be null
        quantity: z.number(),
      }).array(),
      customerId: z.string(),
    }),
  ).mutation(
    async ({ ctx, input }): Promise<Order|null> => {
    if(!input.shippingInfo || !input.items || !input.customerId)  throw new TRPCError({ code: 'BAD_REQUEST' });

    console.log('input', input)
    /// extract Ids to connect items in cart to this order
    /// calc order total based on items received
    const itemIds:PrismaItemId[] = [];
    let orderTotal = 0;
    input.items.map(({ item, quantity }) => {
      if(!!item){
        console.log('mapped item', item.id)
          itemIds.push({ id: item.id });
        orderTotal += item.price * quantity;
      }
    });

    console.log('itemIds', itemIds);
    console.log('orderTotal', orderTotal);

    //TODO: ADD A SHIPPING COST
    try{
      return await ctx.prisma.order.create({
        data: {
          email: input.shippingInfo.email,
          firstName: input.shippingInfo.firstName,
          lastName: input.shippingInfo.lastName,
          country: input.shippingInfo.country,
          stateProvince: input.shippingInfo.stateProvince,
          city: input.shippingInfo.city,
          addressline: input.shippingInfo.addressOne,
          addressline2: input.shippingInfo.addressTwo,
          zipcode: input.shippingInfo.zipCode,
          phoneNumber: input.shippingInfo.phoneNumber,
          items: { connect: itemIds },
          totalPrice: orderTotal,
          customerId: input.customerId,
        }
      })
    } catch(err){
      console.log('err', err)
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }
  });