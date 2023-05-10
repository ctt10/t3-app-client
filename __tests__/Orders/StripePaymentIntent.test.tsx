//TESTING UTILS
import { describe, expect, test, vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
//API TOOLS
import { prisma } from "@/server/db";

/**@data */
import { mockGalleryItem } from "../helpers/mockItemData";
import { orderFormInputValues } from "../helpers/mockOrderData";
// import { mockOrderItems } from "../helpers/mockItemData";

import { TrpcWrapper } from "../helpers/decorator";
import { SingleItem, ShippingMain, CartItem } from "@/components";

import * as PaymentIntentFunctions from "@/utils/hooks/StripePaymentIntentHook";

/**@types */
import { type ICart, type StripePaymentIntent } from "@/types";

// trpc stripe payment intent mock
// vi.mock("@/utils/hooks/StripePaymentIntentHook");

/// test values being sent to api endpoints in hooks are correct
/// test that the values that end up in the database are correct
describe("Order Creation E2E test", () => {

  /**
   * 1 input onChange events are relied on to interact with and test react-hook-form result 
   *     [react-hook-form team has already tested] 
   * 2. click button to submit form
   * 3. begin evaluating spies 
   */
  let paymentIntent_1: StripePaymentIntent;
  let unmountShipping: () => void;
  let itemId: string;

  const paymentIntentSpy = vi.spyOn(PaymentIntentFunctions, "useStripePaymentIntent")
  
  beforeAll(
    async () => {
      // # this also generates customerId && clientSecret
      await prisma.item.create({ data: mockGalleryItem })
        .then((createdObj) => { itemId = createdObj.id });
    });

  /**
   * =========== [TESTS SETUP] ===========
   */
  beforeEach(
    async () => {

      const { unmount } = render(<SingleItem itemId={itemId} />, { wrapper: TrpcWrapper });
      /// await internal api queries to resolve
      ///   && allow component to finish rendering
      await new Promise(r => setTimeout(r, 2000));

      // ADD ITEM TO CART
      const AddButton = screen.getByTestId("#addToCart");
      fireEvent.click(AddButton);
      unmount();

      /// Render SHIPPING PAGE, POPULATE SHIPPING FORM / is localstorage preserved?
      const { unmount:unmount2, getByTestId } = render(<ShippingMain />, { wrapper: TrpcWrapper });
      unmountShipping = unmount2;
      /// SETUP ORDER FORM VALUES 
       orderFormInputValues?.map(input => {
         fireEvent.change(getByTestId(input.label), { target: { value: input.value } });
      })
    }, 5000);

  afterEach(
    () => {
      cleanup();
      localStorage.clear();
      vi.clearAllMocks();
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

  test.skip("expect form to be populated", () => {
      orderFormInputValues.map((input) => {
         expect(screen.getByTestId(input.label)?.value).toEqual(input.value);
      });
  });

  //for a copmlete E2E test,
  //  1. generate a stripePaymentIntent
  //  2. modify the cart to genarate new paymentIntent
  //  3. complete an order and verify that correct paymentIntent is included with order 
  test("generate stripePaymentIntent", 
    async () => { 
      fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));

      /// await internal api queries to resolve
      ///   && allow component to finish rendering
      await new Promise(r => setTimeout(r, 4000));

      //HAS FUNCTION DIRECTLY TRIGGERING API REQUEST BEEN CALLED? WITH WHAT VALUE?
      expect(paymentIntentSpy).toHaveBeenCalled();
      const componentRenderCount = 6;
      expect(paymentIntentSpy).toHaveBeenNthCalledWith(componentRenderCount, mockGalleryItem.price);

      /// VERIFY PAYMENT INTENT HAS BEEN CREATED
      const localCart = window.localStorage.getItem("cart") as string;
      expect(localCart).not.to.equal(null);
      if (!localCart) return;
      const cart = JSON.parse(localCart) as ICart;
      expect(cart.paymentIntent).toBeDefined();
  }, 5000);


  test.skip("generate stripePaymentIntent modify cart, confirm update", 
    async () => {
      /// SET INITIAL PAYMENT INTENT
      fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));
      /// await internal api queries to resolve
      ///   && allow component to finish rendering
      await new Promise(r => setTimeout(r, 4000));

      /// VERIFY PAYMENT INTENT HAS BEEN CREATED
      const localCart = window.localStorage.getItem("cart") as string;
      expect(localCart).not.to.equal(null);
      if (!localCart) return;
      const cart = JSON.parse(localCart) as ICart;
      expect(cart.paymentIntent).toBeDefined();
      if(!cart.paymentIntent) return;

      /// STORE PAYMENT INTENT IN LOCAL TEST STATE FOR LATER COMPARISON
      paymentIntent_1 = cart.paymentIntent;

      /// SIMULATE OPENNING OF CART MENU && REMOVE EVENT
      const { unmount: unmountCart } = render(<CartItem item={mockGalleryItem} qty={mockGalleryItem.quantity} />, { wrapper: TrpcWrapper });
      fireEvent.click(screen.getByTestId("#RemoveFromCart"));
      unmountCart();

      /// TEST CART VALUES AFTER REMOVE EVENT
      const emptiedLocal = window.localStorage.getItem("cart") as string;
      expect(emptiedLocal).not.to.equal(null);
      if (!emptiedLocal) return;
      const emptiedCart = JSON.parse(emptiedLocal) as ICart;
      expect(emptiedCart.paymentIntent).toBeNull();

      //RERENDER ITEM PAGE TO ADD ITEM TO CART
      // SIMULATE NAVIGATING TO ITEM PAGE AND READDING ITEM
      unmountShipping();
      const { unmount } = render(<SingleItem itemId={itemId} />, { wrapper: TrpcWrapper });
      /// await internal api queries to resolve
      ///   && allow component to finish rendering
      await new Promise(r => setTimeout(r, 2000));

      // ADD ITEM TO CART
      const AddButton = screen.getByTestId("#addToCart");
      fireEvent.click(AddButton);
      unmount();

      /// Render SHIPPING PAGE, POPULATE SHIPPING FORM / is localstorage preserved?
      const { getByTestId } = render(<ShippingMain />, { wrapper: TrpcWrapper });
      /// SETUP ORDER FORM VALUES 
      orderFormInputValues?.map(input => {
        fireEvent.change(getByTestId(input.label), { target: { value: input.value } });
      })

      /// RESIMULATE USER FILLS OUT FORM AND PROCEEDS CHECKOUT
      fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));
      /// await internal api queries to resolve
      ///   && allow component to finish rendering
      await new Promise(r => setTimeout(r, 4000));

      /// VERIFY NEW PAYMENT INTENT HAS BEEN CREATED
      const refilledCart = window.localStorage.getItem("cart") as string;
      expect(refilledCart).not.to.equal(null);
      if (!refilledCart) return;

      /// GET UPDATED LOCAL STATE VALUE TO COMPARE WITH PREVIOUS VALUE 
      const updatedCart = JSON.parse(refilledCart) as ICart;

      expect(updatedCart.paymentIntent).toBeDefined();
      if (!updatedCart.paymentIntent) return;
      expect(updatedCart.paymentIntent).not.toStrictEqual(paymentIntent_1);
  },15000);

  /**
   * After clicking payout button, a paymentIntent should be generated and stored in cart
   *   this should trigger the rendering of the stripe payment intent in dom
   */
  test.skip("Render Stripe payment form ",
    async () => {
      /// SET INITIAL PAYMENT INTENT
      fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));
      /// await internal api queries to resolve
      ///   && allow component to finish rendering
      await new Promise(r => setTimeout(r, 4000));

      expect(screen.getByTestId("#STRIPE_PAYMENT_FORM")).toBeInTheDocument();
    }, 5000);

});