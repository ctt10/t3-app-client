//TESTING UTILS
import { describe, expect, test, beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
import { render, screen, act, fireEvent, cleanup } from "@testing-library/react";
//API TOOLS
import { prisma } from "@/server/db";

/**@data */
import { mockGalleryItem } from "../data/mockItemData";
import { mockCartItem } from "../data/mockOrderData";
import { defaultCart } from "@/models";

/**@componentes */
import { TrpcWrapper } from "../helpers/decorator";
import { SingleItem } from "@/components";

/**@types */
import { type ICart } from "@/types";

// router must be mounted since 
//   required in internal components
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe("Cart Integration Tests", () => {
    
  let itemId: string;
  const getSpy = vi.spyOn(localStorage, 'getItem');
  const setSpy = vi.spyOn(localStorage, 'setItem');
  const removeSpy = vi.spyOn(localStorage, 'removeItem');


  beforeAll( async () => {
      await prisma.item.create({ data: mockGalleryItem })
        .then((createdObj) => { itemId = createdObj.id });
  });

  beforeEach( async () => {
      render(<SingleItem itemId={itemId} />, { wrapper: TrpcWrapper });
      await new Promise(r => setTimeout(r, 2000));
  });

  afterEach(() => {
    console.log('localStorage', localStorage)
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterAll( async () => {
      await prisma.item.delete({
        where: { id: itemId }
      });
  });

  async function addCart() {
    //Add item to cart
    expect(screen.getByTestId("#addToCart")).toBeInTheDocument();
    const AddButton = screen.getByTestId("#addToCart");
    await act(() => fireEvent.click(AddButton));
  }

  async function openCart() {
    expect(screen.getByTestId("#OpenCart-Button")).toBeInTheDocument();
    const openCartButton = screen.getByTestId("#OpenCart-Button");
    await act(() => fireEvent.click(openCartButton));
  }

  function verifyCartItem(){
    /// VERIFY ITEM ADDED TO CART
    expect(setSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalledWith(mockCartItem.item);

    // const localCart = localStorage.getItem("cart");
    // console.log('verifyCartItem', localCart);
    // expect(localCart).not.toBeUndefined();
    // expect(localCart).not.toBeNull();

    // const cart = JSON.parse(localCart) as ICart;
    // expect(cart.items).toHaveLength(1);
    // const cartItem = cart.items[0]
    // expect(cartItem?.item).toStrictEqual(mockCartItem.item);
  }

  // The purpose of this test is to confirm that that when clicking addItem
  // the cart is correctly modified (correct number of items && item info)
  // this is confirmed by checking and confirming modifications to dom elements
  // i.e. After Item is added, a new dom element should be rendered in <Cart /> Component
  test("Add To Cart, local Storage modified",
    async () => {
      await addCart();
      verifyCartItem();
    })

  test("Add To Cart, Verify Dom Cart Element Updated", async () => {
    await addCart();
    await openCart();

    //get item price container
    expect(screen.getByTestId("#CartItemPrice")).toBeInTheDocument();
    const itemPriceContainer = screen.getByTestId("#CartItemPrice");
    expect(itemPriceContainer).toHaveTextContent("$150.00");

    //check Cart listed price is correct
    const CartSubTotalContainer = screen.getByTestId("#CartSubTotal");
    // console.log('CartSubTotalContainer', CartSubTotalContainer.textContent)
    expect(CartSubTotalContainer).toHaveTextContent("SubTotal: $150.00");
  })

  test("Remove from cart", async () => {
    await addCart();
    await openCart();
    verifyCartItem();

    //REMOVE EVENT    
    await act(() => fireEvent.click(screen.getByTestId("#RemoveFromCart")));

    //VERIFY REMOVED ITEM
    const localCart = localStorage.getItem("cart");
    console.log('localItems', localCart)
    expect(localCart).not.to.equal(null);
    if (!localCart) return;
    const emptyCart = JSON.parse(localCart) as ICart;
    expect(emptyCart).toStrictEqual(defaultCart);
  })
})