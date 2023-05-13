// TESTING UTILS
import { describe, expect, test, beforeAll, afterAll } from 'vitest';
// API CONTEXT
import { appRouter } from '@/server/api/root';
//API TOOLS
import { prisma } from "@/server/db";

/**@data */
import { mockOrderItems } from "../data/mockItemData";
import { mockOrderInput } from "../data/mockOrderData";
import { type IGalleryItem } from '@/types';

describe("Order Creation", () => {

  let orderId:string;
  const itemIds: string[] = [];
  const caller = appRouter.createCaller({ session: null, prisma });

  beforeAll(async () => {
    for (const obj of mockOrderItems) {
      if (!obj) return;
      await prisma.item.create({ data: obj.item as IGalleryItem })
        .then((createdObj) => {
          itemIds.push(createdObj.id);
        });
    }
  });

  afterAll(async () => {
    await prisma.item.deleteMany({
      where: {
        id: { in: itemIds },
      }
    })

    if (!!orderId) {
      await prisma.item.delete({
        where: { id: orderId }
      });
    }
  });

  
  describe("Unmounted Create Order API Request", () => {

    test("Throws an Error", async () => {
      // expect(await caller.order.create(null)).toThrowError()
      // expect(
      //   caller.order.create(null)
      // ).toThrowError();

      // const response = await caller.order.create(null);
      // expect(response).toBeNull();
    });

    test("Resolves with order created", async () => {
      // const response = await caller.order.create();
      // expect(response).toBeDefined();
      // expect(response?.clientSecret).toBeDefined();
      // expect(response?.customerId).toBeDefined();
    });
  });
  /**
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