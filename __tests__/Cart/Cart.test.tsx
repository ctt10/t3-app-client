import React from 'react';
//TESTING UTILS
import { describe, expect, test, beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, renderHook } from '@testing-library/react';
//API TOOLS
import { prisma } from '@/server/db';

/**@data */
import { mockGalleryItem } from '../data/mockItemData';
import { mockCartItem } from '../data/mockOrderData';
import { defaultCart } from '@/models';

/**@componentes */
import { TrpcWrapper } from '../helpers/CartDecorator';
import { SingleItem } from '@/components';

/**@types */
import { type ICart } from '@/types';

/** @spyModules */
import * as FetchSingleHook from '@/utils/hooks/useFetchSingle';
/** @mockModule */
import { useFetchSingle } from '@/utils/hooks/useFetchSingle';

// router must be mounted since 
//   required in internal components
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

//Hoisted Mock Example
//Mock this not not wait for API requests to resolve
// Inner API Reqeust no longer called
// vi.mock('@/utils/hooks/useFetchSingle', () => ({
//   useFetchSingle: () => ({
//     data: mockGalleryItem,
//     refetchSingle: vi.fn()
//   })
// }));

describe('Cart Items Modification', () => {

  let itemId: string;
  const fetchSingleSpy = vi.spyOn(FetchSingleHook, 'useFetchSingle');

  beforeAll(async () => {
    await prisma.item.create({ data: mockGalleryItem })
      .then((createdObj) => itemId = createdObj.id);
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.item.delete({
      where: { id: itemId }
    });
  });

  async function addToCart() {
    expect(await screen.findByTestId('#addToCart')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('#addToCart'));
  }

  async function openCart() {
    expect(await screen.findByTestId('#OpenCart-Button')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('#OpenCart-Button'));
  }

  function verifyItemAdded() {
    const localCart = localStorage.getItem('cart');
    expect(localCart).toBeDefined();
    expect(localCart).not.toBeNull();

    const cart = JSON.parse(localCart) as ICart;
    expect(cart.items).toHaveLength(1);
    const cartItem = cart.items[0]
    expect(cartItem?.item).toStrictEqual(mockCartItem.item);
  }


  describe('useFetchSingle, Unmocked Hook', () => {

    afterEach(() => { 
      cleanup() 
      vi.restoreAllMocks();
    });

    test('Returns null when no itemId provided', async () => {
      const { result } = renderHook(() => useFetchSingle(undefined, undefined),
        { wrapper: TrpcWrapper }
      );
      await new Promise(r => setTimeout(r, 2000));
      expect(fetchSingleSpy).toHaveBeenCalled();
      expect(result?.current?.data).toBeNull();
    });

    //this has an internal hook, trpc request that throws an 'act required error'
    test('Returns item when itemId is provided', async () => {
      const { result } = renderHook(() => useFetchSingle(itemId, undefined),
        { wrapper: TrpcWrapper }
      );
      await new Promise(r => setTimeout(r, 2000));
      expect(fetchSingleSpy).toHaveBeenCalled();
      expect(result.current.data).toStrictEqual(mockGalleryItem);
    });
  });


  describe('Render Component, Test Cart Functionality', () => {

    describe('On Component Render, Unmocked Hook', () => {
      afterEach(() => {
        cleanup()
        vi.restoreAllMocks();
      });

      test('Api Request resolves with data === null when itemId empty string', async () => {
        render(<SingleItem itemId="" />, { wrapper: TrpcWrapper });
        await new Promise(r => setTimeout(r, 2000));

        expect(fetchSingleSpy).toHaveBeenCalled();
        expect(fetchSingleSpy).toHaveBeenCalledWith("", undefined);
        expect(await screen.findByTestId('#addToCart')).toBeDisabled();
      })

      test('Api Request resolves with data when given itemId', async () => {
        render(<SingleItem itemId={itemId} />, { wrapper: TrpcWrapper });
        await new Promise(r => setTimeout(r, 2000));

        expect(fetchSingleSpy).toHaveBeenCalled();
        expect(fetchSingleSpy).toHaveBeenCalledWith(itemId, undefined);
        expect(await screen.findByTestId('#addToCart')).not.toBeDisabled();
      });
    });

    describe("On Component Render, With Mocked Hook Resolve Value", () => {
      beforeEach(() => {
        fetchSingleSpy.mockImplementation(() => ({
          data: mockGalleryItem,
          refetchSingle: vi.fn()
        }));
      })

      describe('Click "Add to Cart"', () => {
        afterEach(() => {
          cleanup();
          localStorage.clear();
          vi.restoreAllMocks();
        });

        test('Local Storage modified', async () => {
          render(<SingleItem itemId={itemId} />, { wrapper: TrpcWrapper });
          expect(fetchSingleSpy).toHaveBeenCalled();
          await addToCart();
          verifyItemAdded();
        })

        test('Cart Dom Element Updated with new Item', async () => {
          render(<SingleItem itemId={itemId} />, { wrapper: TrpcWrapper });
          await addToCart();
          await openCart();

          //get item price container
          expect(await screen.findByTestId('#CartItemPrice')).toBeInTheDocument();
          expect(screen.getByTestId('#CartItemPrice')).toHaveTextContent('$150.00');

          //check Cart listed price is correct
          expect(screen.getByTestId('#CartSubTotal')).toHaveTextContent('SubTotal: $150.00');
        });
      });

      describe('Click "Remove from cart"', () => {
        afterEach(() => {
          cleanup();
          localStorage.clear();
          vi.restoreAllMocks();
        });

        test('Add then Remove from cart', async () => {
          render(<SingleItem itemId={itemId} />, { wrapper: TrpcWrapper });

          await addToCart();
          await openCart();
          verifyItemAdded();

          //REMOVE EVENT
          fireEvent.click(screen.getByTestId('#RemoveFromCart'));

          //VERIFY ITEM REMOVED
          const localCart = localStorage.getItem('cart');
          expect(localCart).not.toBeNull();
          if (!localCart) return;
          const emptyCart = JSON.parse(localCart) as ICart;
          expect(emptyCart).toStrictEqual(defaultCart);
        })
      });
    
    })

  })
})