// TESTING UTILS
import { describe, expect, test, beforeAll, afterAll } from 'vitest';
// API CONTEXT
import { appRouter } from '@/server/api/root';
//API TOOLS
import { prisma } from "@/server/db";

/**@data */
import { mockOrderItems } from "../helpers/mockItemData";
import { mockOrderInput } from "../helpers/mockOrderData";
import { type IGalleryItem, type PrismaItemId } from '@/types';

describe("Order Creation E2E test", () => {

  const itemIds:PrismaItemId[]= [];
  let orderId:string;
  const caller = appRouter.createCaller({ session: null, prisma });

  /**
   * =========== [TESTS SETUP] ===========
   */
  //paymentId is currently null
  beforeAll(
    async() => {
      await prisma.item.create({ data: mockOrderItems[0]?.item as IGalleryItem })
        .then((createdObj) => { itemIds.push({ id: createdObj.id }) });
      await prisma.item.create({ data: mockOrderItems[1]?.item as IGalleryItem })
        .then((createdObj) => { itemIds.push({ id: createdObj.id }) });
  
      return async () => {
        for (const val of itemIds) {
          await prisma.item.delete({
            where: {
              id: val.id
            }
          });
        }
        if (!!orderId) {
          await prisma.item.delete({
            where: { id: orderId }
          });
        }
      }
  });

  /**
   * // Setup requires trpc caller to be passed mock values
   * 
   * 1. Confirm that correct items are being used in order
   * 2. Test order totalPrice is correct
   * 3. Confirm that Customer Id is correct
   * 4. Confirm that Order is created creation output
   */
  test("Input order values are correct",
    async () => {
      const order = await caller.order.create(mockOrderInput);
      console.log('order', order)
      expect(order).toBeDefined();


      /// setup to test mock order creation
    }, 10000)

  /**
   * Call prisma using the orderId to confirm order exists
   *   also confirms that data retrieved from db matches the order going in
   */
  test.skip("Database order values are correct", () => {
    //do stuff
  })
});