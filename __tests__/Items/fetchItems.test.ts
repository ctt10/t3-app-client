//TESTING UTILS
import { describe, expect, test, beforeAll } from 'vitest';
//CONTEXT
import { appRouter } from '@/server/api/root';
//API TOOLS
import { prisma } from "@/server/db";

/**@data */
import { mockItems, itemTypes, MacrameSubTypes, GemstoneSubTypes } from "../helpers/mockItemData";
import { galleryThemes } from '@/utils/constants/galleryThemes'

/**@types */
// import { type Item } from "@/types";
import { type PrismaItemId } from "@/types";

describe("Fetch Items test", () => {
    
    /// THE PURPOSE OF THIS TEST IS NOT TO TEST THE DATABASE CONNECTION, 
    /// IT IS TO TEST THAT THE API ENDPOINT IS EXECUTING CORRECTLY
    /// TO ACHIEVE THIS, A PRISMA MOCK/SPY IS USED,
    /// MOCK INPUT IS GIVEN,
    /// CONFIRM THAT THE OUTPUT MATCHES THE EXPECTED INPUT
    const caller = appRouter.createCaller({ session: null, prisma:prisma })

    // create an array of ids to check that Items exist later
    // this will also aid in test taredown since ids can be used
    const itemIds: PrismaItemId[] = [];
  
    /**
     * =========== [TESTS SETUP] ===========
     */
    beforeAll(
      async () => {
        //setup mock values in db      
      for (const obj of mockItems) {
          if(!obj) return;
            await prisma.item.create({ 
              data: obj,
            }).then((createdObj)=> {
              itemIds.push({ id: createdObj.id });
            });
        }

        console.log('itemIds', itemIds)

        /**
         * =========== [TESTS CLEANUP] ===========
         */
        return async () => {
          for (const val of itemIds) {
            await prisma.item.delete({
              where: {
                id: val.id
              }
            });
          }    
        }
    }, 20000);

    /**
     * =========== [TESTS START] ===========
     * Query types to test
     *  - fetchByType (Macrame, Gemstone)
     *  - fetchByTheme (GalleryThemes) //6
     * 
     * 
     * 
     * 
     * 
     * 
     *   -make sure that all tests are pulling the correct itemType || Theme
     */
    test("Fetch Gallery Macrame  Gallery", 
      async() => {
        const result = await caller.item.fetchByType({ itemType: "Macrame" });
        expect(result !== undefined); //Seed DB with mock data

        // console.log('result', result);
        result?.map((item):void => {
          expect(item.id.length).toBeGreaterThan(10);
          expect(item.name.length).toBeGreaterThan(2);
          expect(item.price).toBeGreaterThan(0);
          expect(item.quantity).toBeGreaterThan(0);

          //item Shouldn't have Gemstone type properties
          expect(item.itemType === "Macrame");
          expect(MacrameSubTypes.includes(item.subType));
          expect(GemstoneSubTypes.indexOf(item.subType) === -1);
          
          expect(item.description.length).toBeGreaterThan(10);
        })
    });

  test("Fetch Gallery Gemstone Gallery",
    async () => {
      const result = await caller.item.fetchByType({ itemType: "Gemstone" });
      expect(result !== undefined); //Seed DB with mock data

      // console.log('result', result);
      result?.map((item): void => {
        expect(item.id.length).toBeGreaterThan(10);
        expect(item.name.length).toBeGreaterThan(2);
        expect(item.price).toBeGreaterThan(0);
        expect(item.quantity).toBeGreaterThan(0);

        //item Shouldn't have Gemstone type properties
        expect(item.itemType === "Macrame");
        expect(MacrameSubTypes.includes(item.subType));
        expect(GemstoneSubTypes.indexOf(item.subType) === -1);

        expect(item.description.length).toBeGreaterThan(10);
      })
    });

    test("Fetch Gallery Items by Theme 1", 
      async () => {
        const result = await caller.item.fetchByTheme({ theme: galleryThemes[0] as string });
        expect(result !== undefined); //Seed DB with mock data

        // console.log('result', result);
        result?.map((item): void => {
          expect(item.id.length).toBeGreaterThan(10);
          expect(item.name.length).toBeGreaterThan(2);
          expect(item.price).toBeGreaterThan(0);
          expect(item.quantity).toBeGreaterThan(0);

          //item Shouldn't have Gemstone type properties
          expect(item.itemType === "Gemstone");
          expect(MacrameSubTypes.indexOf(item.subType) === -1);
          expect(GemstoneSubTypes.includes(item.subType));

          expect(item.description.length).toBeGreaterThan(10);
        })
    });

    test("Fetch Gallery Items by Theme 2", 
      async () => {

        const result = await caller.item.fetchByTheme({ theme: galleryThemes[1] as string });
        expect(result !== undefined); //Seed DB with mock data
        // console.log('result', result);

        result?.map((item):void => {
          expect(item.id.length).toBeGreaterThan(10);
          expect(item.name.length).toBeGreaterThan(2);
          expect(item.price).toBeGreaterThan(0);
          expect(item.quantity).toBeGreaterThan(0);

          //item value among valid itemType options
          expect(itemTypes.includes(item.itemType));
          if(item.itemType === "Macrame"){
            expect(MacrameSubTypes.includes(item.subType));
          }
          if(item.itemType === "Gemstone"){
            expect(GemstoneSubTypes.includes(item.subType));
          }
          expect(item.description.length).toBeGreaterThan(10);
        })
    });
});