//TESTING UTILS
import { describe, expect, test, beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
//API TOOLS
import { prisma } from "@/server/db";

/**@data */
import { mockGalleryItem } from "../helpers/mockItemData";
import { mockCartItem } from "../helpers/mockOrderData";
import { defaultCart } from "@/models";

/**@componentes */
import { TrpcWrapper } from "../helpers/decorator";
import { SingleItem } from "@/components";

/**@types */
import { type ICart } from "@/types";

describe("Cart Integration Tests", () => {

  // router must be mounted since 
  //   required in internal components
  vi.mock('next/router', () => ({
    useRouter: () => ({
      push: vi.fn(),
    }),
  }))
  
  let itemId: string;
  beforeAll(
    async () => {
      await prisma.item.create({ data: mockGalleryItem })
        .then((createdObj) => { itemId = createdObj.id });
    });

  /**
   * =========== [TESTS SETUP] ===========
   */
  beforeEach(
    async () => {
      render(<SingleItem itemId={itemId} />, { wrapper: TrpcWrapper });

      /// await internal api queries to resolve
      /// && component to finish rendering
      await new Promise(r => setTimeout(r, 2000));
    }, 5000);

  /**
   * =========== [RESET BETWEEN TESTS] ===========
   */
  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  /**
   * =========== [POST TESTS CLEANUP] ===========
   */
  afterAll(
    async () => {
      await prisma.item.delete({
        where: { id: itemId }
      });
    });

  // The purpose of this test is to confirm that that when clicking addItem
  // the cart is correctly modified (correct number of items && item info)
  // this is confirmed by checking and confirming modifications to dom elements
  // i.e. After Item is added, a new dom element should be rendered in <Cart /> Component
  test("Add To Cart, local Storage modification",
    () => {
      //Add item to cart
      expect(screen.getByTestId("#addToCart")).toBeInTheDocument();
      const AddButton = screen.getByTestId("#addToCart");
      fireEvent.click(AddButton);

      const localItems = window.localStorage.getItem("cart");
      expect(localItems).not.to.equal(null);
      if (!localItems) return;

      const cart = JSON.parse(localItems) as ICart;
      const cartItem = cart.items[0]
      expect(cartItem).toStrictEqual(mockCartItem);
    })

  /**
   * confirms base state of testing envrionment has empty cart in local storage
   *   and 0 elements in dom
   */
  test("Verify Unmodified Cart Dom Content", () => {

    expect(screen.getByTestId("#OpenCart-Button")).toBeInTheDocument();
    const openCartButton = screen.getByTestId("#OpenCart-Button");
    fireEvent.click(openCartButton);

    //no items in cart, value should be 0
    const itemPriceContainer = screen.getByTestId("#CartSubTotal");
    expect(itemPriceContainer).toHaveTextContent("SubTotal: $0.00");
  })

  test("Add To Cart, Update Dom Element Cart", () => {
    //Add item to cart
    expect(screen.getByTestId("#addToCart")).toBeInTheDocument();
    const AddButton = screen.getByTestId("#addToCart");
    fireEvent.click(AddButton);

    //open cart
    expect(screen.getByTestId("#OpenCart-Button")).toBeInTheDocument();
    const openCartButton = screen.getByTestId("#OpenCart-Button");
    fireEvent.click(openCartButton);

    //get item price container
    expect(screen.getByTestId("#CartItemPrice")).toBeInTheDocument();
    const itemPriceContainer = screen.getByTestId("#CartItemPrice");
    expect(itemPriceContainer).toHaveTextContent("$150.00");

    //check Cart listed price is correct
    const CartSubTotalContainer = screen.getByTestId("#CartSubTotal");
    // console.log('CartSubTotalContainer', CartSubTotalContainer.textContent)
    expect(CartSubTotalContainer).toHaveTextContent("SubTotal: $150.00");
  })

  test("Remove from cart", () => {
    //Add item to cart
    expect(screen.getByTestId("#addToCart")).toBeInTheDocument();
    const AddButton = screen.getByTestId("#addToCart");
    fireEvent.click(AddButton);

    //UPDATE DOM TO FIND REMOVE BUTTON
    const openCartButton = screen.getByTestId("#OpenCart-Button");
    fireEvent.click(openCartButton);

    //VERIFY ADDED ITEM EXISTS
    let localCart = window.localStorage.getItem("cart");
    expect(localCart).not.to.equal(null);
    if (!localCart) return;

    const cart = JSON.parse(localCart) as ICart;
    const cartItem = cart.items[0];
    expect(cartItem?.item).toBeDefined();
    expect(cartItem?.item).toStrictEqual(mockCartItem.item);

    //REMOVE EVENT
    fireEvent.click(screen.getByTestId("#RemoveFromCart"));

    //VERIFY REMOVED ITEM
    localCart = window.localStorage.getItem("cart");
    console.log('localItems', localCart)
    expect(localCart).not.to.equal(null);
    if (!localCart) return;

    const emptyCart = JSON.parse(localCart) as ICart;
    expect(emptyCart).toStrictEqual(defaultCart);
  })
})