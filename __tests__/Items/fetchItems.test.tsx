import React from "react";
//TESTING UTILS
import { describe, expect, test, beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, cleanup } from "@testing-library/react";

//API TOOLS
import { appRouter } from '@/server/api/root';
import { prisma } from '@/server/db';

/**@componentes */
import { TrpcWrapper } from '../helpers/CartDecorator';
import GalleryPage from '@/pages/gallery';
import FeaturedPage from '@/pages/featured';

/**@data */
import { mockItems, MacrameSubTypes, GemstoneSubTypes } from '../data/mockItemData';
import { galleryThemes } from '@/utils/constants/galleryThemes'

/** @spyModules */
import * as FetchTypeHook from '@/utils/hooks/useFetchType';
import * as FetchThemeHook from '@/utils/hooks/useFetchTheme';
/** @mockModule */
import { useFetchType } from '@/utils/hooks/useFetchType';
import { useFetchTheme } from '@/utils/hooks/useFetchTheme';

import { createMockRouter } from '__tests__/setup/createMockRouter';
import { RouterContext } from 'next/dist/shared/lib/router-context';

describe('Render Gallery Tests', () => {

  const fetchTypeSpy = vi.spyOn(FetchTypeHook, 'useFetchType');
  const fetchThemeSpy = vi.spyOn(FetchThemeHook, 'useFetchTheme');

  const caller = appRouter.createCaller({ session: null, prisma })

  //Setup Mock values In real database  
  //Item by Item creation allows for retrieval of ids for post test cleanup      
  const itemIds: string[] = [];
  beforeAll(async () => {
    for (const obj of mockItems) {
      if (!obj) return;
      await prisma.item.create({ data: obj }).then((createdObj) => {
        itemIds.push(createdObj.id);
      });
    }
  }, 10000);

  afterAll(
    async () => {
      await prisma.item.deleteMany({
        where: {
          id: { in: itemIds },
        }
      })
    });

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("ItemType Gallery", () => {

    describe('Direct tRPC Api Requests,  Unmocked && Unmounted', () => {

      test.concurrent("FetchByType: Macrame", async () => {
        const result = await caller.item.fetchByType({ itemType: 'Macrame' });
        expect(result).toBeDefined();
        expect(result?.length).toBeGreaterThan(0);

        result?.map((item): void => {
          expect(item.itemType).toBe('Macrame');
          //item Shouldn't have Gemstone type properties
          expect(GemstoneSubTypes.indexOf(item.subType)).toBe(-1);
          //item Should have Macrame type properties
          expect(MacrameSubTypes.indexOf(item.subType)).toBeGreaterThanOrEqual(0);
        })
      });

      test.concurrent('FetchByType: Gemstone', async () => {
        const result = await caller.item.fetchByType({ itemType: 'Gemstone' });
        expect(result).toBeDefined();
        expect(result?.length).toBeGreaterThan(0);

        result?.map((item) => {
          expect(item.itemType).toBe('Gemstone');
          //item Should have Gemstone type properties
          expect(GemstoneSubTypes.indexOf(item.subType)).toBeGreaterThanOrEqual(0);
          //item Shouldn't have Macrame type properties
          expect(MacrameSubTypes.indexOf(item.subType)).toBe(-1);
        })
      });
    });

    describe("useFetchType, Unmocked Hook", () => {

      afterEach(() => { 
        cleanup() 
        vi.restoreAllMocks()
      });

      test('Hook Returns data === null when no itemType provided', async () => {
        const { result } = renderHook(() => useFetchType(undefined),
          { wrapper: TrpcWrapper }
        );
        await new Promise(r => setTimeout(r, 2000));
        expect(fetchTypeSpy).toHaveBeenCalled();
        expect(fetchTypeSpy).toHaveBeenCalledWith(undefined);
        expect(result?.current?.data).toBeNull();
      });

      //this has an internal hook, trpc request that throws an 'act required error'
      test('Hook Returns Macrame items when "Macrame" is provided', async () => {
        const { result } = renderHook(() => useFetchType("Macrame"),
          { wrapper: TrpcWrapper }
        );
        await new Promise(r => setTimeout(r, 2000));
        expect(result.current.data).toBeDefined();
        expect(result?.current?.data?.length).toBeGreaterThan(0);

        expect(fetchTypeSpy).toHaveBeenCalled();
        expect(fetchTypeSpy).toHaveBeenCalledWith("Macrame");

        result.current.data.map((item): void => {
          expect(item.itemType).toBe('Macrame');
          //item Shouldn't have Gemstone type properties
          expect(GemstoneSubTypes.indexOf(item.subType)).toBe(-1);
          //item Should have Macrame type properties
          expect(MacrameSubTypes.indexOf(item.subType)).toBeGreaterThanOrEqual(0);
        })
      });

      test('Hook Returns Gemstone items when "Gemstone" is provided', async () => {
        const { result } = renderHook(() => useFetchType("Gemstone"),
          { wrapper: TrpcWrapper }
        );
        await new Promise(r => setTimeout(r, 2000));
        expect(result.current.data).toBeDefined();
        expect(result?.current?.data?.length).toBeGreaterThan(0);

        expect(fetchTypeSpy).toHaveBeenCalled();
        expect(fetchTypeSpy).toHaveBeenCalledWith("Gemstone");

        result.current.data.map((item) => {
          expect(item.itemType).toBe('Gemstone');
          //item Should have Gemstone type properties
          expect(GemstoneSubTypes.indexOf(item.subType)).toBeGreaterThanOrEqual(0);
          //item Shouldn't have Macrame type properties
          expect(MacrameSubTypes.indexOf(item.subType)).toBe(-1);
        })

      });
    });

    describe("Mount Item Gallery", () => {
      afterEach(()=> { 
        cleanup(), 
        vi.restoreAllMocks()
      })
              
      test("Renders Image in gallery", async () => {
        render(
          <RouterContext.Provider value={createMockRouter({ query: { itemType: "Macrame"} })}>
            <GalleryPage />
          </RouterContext.Provider>,
          { wrapper: TrpcWrapper })
        await new Promise(r => setTimeout(r, 2000));

        expect(await screen.findAllByAltText("Item Image")).toBeTruthy();
      });

      test("Api Reqest is called during render", async () => {
        render(
          <RouterContext.Provider value={createMockRouter({ query: { itemType: "Macrame" } })}>
            <GalleryPage />
          </RouterContext.Provider>,
          { wrapper: TrpcWrapper })
        await new Promise(r => setTimeout(r, 2000));

        expect(fetchTypeSpy).toHaveBeenCalled();
        expect(fetchTypeSpy).toHaveBeenCalledWith("Macrame");
      });
    });
  });


  describe("Theme Gallery", () => {
   
    describe('Direct tRPC Api Requests,  Unmocked && Unmounted', () => {

      describe("fetchByTheme", () => {
        test.concurrent('Fetch Gallery Items by Theme 1', async () => {
          const result = await caller.item.fetchByTheme({ theme: galleryThemes[0] as string });
          expect(result).toBeDefined()
          expect(result?.length).toBeGreaterThan(0);
          result?.map((item): void => {
            expect(item.theme).toBe(galleryThemes[0])
          })
        });

        test.concurrent('Fetch Gallery Items by Theme 2', async () => {
          const result = await caller.item.fetchByTheme({ theme: galleryThemes[1] as string });
          expect(result).toBeDefined()
          expect(result?.length).toBeGreaterThan(0);
          result?.map((item): void => {
            expect(item.theme).toBe(galleryThemes[1])
          })
        });
      });
    });
    
    describe("useFetchTheme, Unmocked Hook", () => {

      afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
      });

      test('Hook Returns data === null when no theme provided', async () => {
        const { result } = renderHook(() => useFetchTheme(undefined),
          { wrapper: TrpcWrapper }
        );
        await new Promise(r => setTimeout(r, 3000));
        expect(fetchThemeSpy).toHaveBeenCalled();
        expect(fetchThemeSpy).toHaveBeenCalledWith(undefined);
        expect(result?.current?.data).toBeNull();
      });

      //this has an internal hook, trpc request that throws an 'act required error'
      test('Hook Returns galleryTheme[0] items when first galleryTheme[0] is provided', async () => {
        const { result } = renderHook(() => useFetchTheme(galleryThemes[0]),
          { wrapper: TrpcWrapper }
        );
        await new Promise(r => setTimeout(r, 3000));
        console.log('result', result);
        expect(result.current.data).toBeDefined();
        expect(result?.current?.data?.length).toBeGreaterThan(0);

        expect(fetchThemeSpy).toHaveBeenCalled();
        expect(fetchThemeSpy).toHaveBeenCalledWith(galleryThemes[0]);
        expect(fetchThemeSpy).toHaveBeenNthCalledWith(2, galleryThemes[0]);

        result.current.data.map((item): void => {
          expect(item.theme).toBe(galleryThemes[0]);
        })
      });

      test('Hook Returns galleryTheme[1] items when second galleryTheme[1] is provided', async () => {
        const { result } = renderHook(() => useFetchTheme(galleryThemes[1]),
          { wrapper: TrpcWrapper }
        );
        await new Promise(r => setTimeout(r, 3000));
        console.log('result', result);
        expect(result.current.data).toBeDefined();
        expect(result?.current?.data?.length).toBeGreaterThan(0);

        expect(fetchThemeSpy).toHaveBeenCalled();
        expect(fetchThemeSpy).toHaveBeenCalledWith(galleryThemes[1]);
        expect(fetchThemeSpy).toHaveBeenNthCalledWith(2, galleryThemes[1]);

        result.current.data.map((item) => {
          expect(item.theme).toBe(galleryThemes[1]);
        })

      });
    });

    describe("Mount featured Gallery", () => {

      afterEach(() => {
        cleanup(),
          vi.restoreAllMocks()
      })

      test("Renders Image in gallery", async () => {
        render(
          <RouterContext.Provider value={createMockRouter({ query: { theme: galleryThemes[0] } })}>
            <FeaturedPage />
          </RouterContext.Provider>,
          { wrapper: TrpcWrapper })
        await new Promise(r => setTimeout(r, 2000));

        expect(await screen.findAllByAltText("Item Image")).toBeTruthy();
      });

      test("Api Reqest is called during render", async () => {
        render(
          <RouterContext.Provider value={createMockRouter({ query: { theme: galleryThemes[0] } })}>
            <FeaturedPage />
          </RouterContext.Provider>,
          { wrapper: TrpcWrapper })
        await new Promise(r => setTimeout(r, 2000));

        expect(fetchThemeSpy).toHaveBeenCalled();
        expect(fetchThemeSpy).toHaveBeenCalledWith(galleryThemes[0]);
      });    
    });
  })
});