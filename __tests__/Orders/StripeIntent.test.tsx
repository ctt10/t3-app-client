import React from "react";
//TESTING UTILS
import { describe, expect, test, vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
/// COMPONENTS IN TEST
import { TrpcWrapper } from "../helpers/decorator";
import { SingleItem, ShippingMain, CartItem } from "@/components";
// DB
import { prisma } from "@/server/db";
import { appRouter } from "@/server/api/root";
import { createInnerTRPCContext } from "@/server/api/trpc";

/** @spyModules */
import * as PaymentIntentFunctions from "@/utils/hooks/StripePaymentIntentHook";
import * as FetchSingleHook from '@/utils/hooks/useFetchSingle';

/** @data */
import { mockGalleryItem } from "../data/mockItemData";
import { orderFormInputValues } from "../data/mockOrderData";
/** @types */
import { type ICart, type StripePaymentIntent } from '@/types';

/**
 * WHAT TESTS ARE ABSOLUTE MUST
 * - MOCKED VALUES AND FUNCTIONS ARE SETUP CORRECTLY
 * - STRIPE PAYMENT INTENT IS GENERATED WHEN CHECKOUT REQUEST WITH ITEM IN CART
 * - NEW STRIPE PAYMENT INTENT IS GENERATED WHEN CART UPDATED (payment intent is specific to amount)
 */
describe("Generate Stripe payment Intent", () => {
	
	/// TEST GLOBALS;
	const fetchSingleSpy = vi.spyOn(FetchSingleHook, 'useFetchSingle');
	const paymentIntentSpy = vi.spyOn(PaymentIntentFunctions, "useStripePaymentIntent")

	/// POPULATE DATABASE
	let itemId: string; /// build && cleanup
	beforeAll(async () => {
		// # this also generates customerId && clientSecret
		await prisma.item.create({ data: mockGalleryItem })
        	.then((createdObj) => { itemId = createdObj.id });
    });

	/// TEST TEARDOWN DB CLEANUP,
	afterAll( async () => {
		await prisma.item.delete({
        	where: { id: itemId }
		});
    });

	describe("Unmounted PaymentIntent API Request", () => {
		const ctx = createInnerTRPCContext({ session: null });
		const caller = appRouter.createCaller(ctx);

		test("Returns undefined when orderSubTotal undefined", async () => {
			const response = await caller.order.StripePaymentIntent({ orderSubTotal: undefined });
			expect(response).toBeNull();
		});

		test("Returns data when orderSubTotal is a number", async () => {
			const response = await caller.order.StripePaymentIntent({ orderSubTotal: 100 });
			expect(response).toBeDefined();
			expect(response?.clientSecret).toBeDefined();
			expect(response?.customerId).toBeDefined();
		});		
	});


	/**
	 * - render single item page
	 * - add to cart
	 * - fill in checkout form
	 */
	async function setupPaymentIntentDom() {
		const { unmount } = render(<SingleItem itemId={itemId} />, { wrapper: TrpcWrapper });
		expect(fetchSingleSpy).toHaveBeenCalled();
		expect(fetchSingleSpy).toHaveBeenCalledWith(itemId, undefined);

		// ADD ITEM TO CART
		expect(await screen.findByTestId("#addToCart")).toBeInTheDocument();
		fireEvent.click(screen.getByTestId("#addToCart"));
		unmount();

		/// Render SHIPPING PAGE, POPULATE SHIPPING FORM / is localstorage preserved?
		render(<ShippingMain />, { wrapper: TrpcWrapper });

		/// SETUP ORDER FORM VALUES 
		orderFormInputValues?.map(input => {
			fireEvent.change(screen.getByTestId(input.label), { target: { value: input.value } });
		});
	}

	function verifyPaymentIntentCreated() {
		const localCart = localStorage.getItem("cart") as string;
		expect(localCart).toBeDefined();
		expect(localCart).not.toBeNull();

		const cart = JSON.parse(localCart) as ICart;
		// console.log('verifyPaymentIntentCreated', cart.paymentIntent)
		expect(cart.paymentIntent).toBeDefined();
		expect(cart.paymentIntent).not.toBeNull();
	}

	function verifyPaymentIntentDeleted() {
		const emptiedLocal = localStorage.getItem("cart") as string;
		expect(emptiedLocal).toBeDefined();
		expect(emptiedLocal).not.toBeNull();

		const emptiedCart = JSON.parse(emptiedLocal) as ICart;
		// console.log('verifyPaymentIntentDeleted', emptiedCart)
		expect(emptiedCart.paymentIntent).toBeNull();
	}


	//for a copmlete E2E test,
	//  1. generate a stripePaymentIntent
	//  2. modify the cart to genarate new paymentIntent
	//  3. complete an order and verify that correct paymentIntent is included with order 
	describe("PaymentIntent Requests from Mounted Component", () => {

		/// Set Mock Item Values used in tests 
		beforeEach(() => {
			fetchSingleSpy.mockImplementation(() => ({
				data: mockGalleryItem,
				refetchSingle: vi.fn()
			}));
		});

		afterEach(() => {
			cleanup(); /// RTL, CLEANUP DOM
			localStorage.clear();
			vi.clearAllMocks();
		});

		// PaymentIntent updates when modifying cart
		test("expect form to be populated correctly", async() => {
			await setupPaymentIntentDom();
			orderFormInputValues.map((input) => {
				expect(screen.getByTestId(input.label)?.value).toEqual(input.value);
			});
		});

		test("StripePaymentIntent Created", async () => {
			await setupPaymentIntentDom();
			fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));
			await new Promise(r => setTimeout(r, 4000));
			
			expect(paymentIntentSpy).toHaveBeenCalled();
			expect(paymentIntentSpy).toHaveBeenCalledWith(mockGalleryItem.price);
			verifyPaymentIntentCreated();
		});

		test("cart modified, payment Intent Cleared", async () => {
			await setupPaymentIntentDom();
			fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));
			await new Promise(r => setTimeout(r, 4000));
			expect(paymentIntentSpy).toHaveBeenCalled();
			verifyPaymentIntentCreated();

			/// SIMULATE OPENNING OF CART MENU && REMOVE EVENT
			render(<CartItem item={mockGalleryItem} qty={mockGalleryItem.quantity} />, { wrapper: TrpcWrapper });
			fireEvent.click(await screen.findByTestId("#RemoveFromCart"));
			verifyPaymentIntentDeleted();
		});

		let paymentIntent_1: StripePaymentIntent;
		test("generate stripePaymentIntent modify cart, confirm update", async () => {
			await setupPaymentIntentDom();
			/// SET INITIAL PAYMENT INTENT
			fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));
			await new Promise(r => setTimeout(r, 4000));

			/// VERIFY PAYMENT INTENT HAS BEEN CREATED
			verifyPaymentIntentCreated();

			/// STORE PAYMENT INTENT IN LOCAL TEST STATE FOR LATER COMPARISON
			const localCart = localStorage.getItem("cart") as string;
			const cart = JSON.parse(localCart) as ICart;
			paymentIntent_1 = cart.paymentIntent as StripePaymentIntent;

			/// SIMULATE OPENNING OF CART MENU && REMOVE EVENT
			render(<CartItem item={mockGalleryItem} qty={mockGalleryItem.quantity} />, { wrapper: TrpcWrapper });
			fireEvent.click(screen.getByTestId("#RemoveFromCart"));
			verifyPaymentIntentDeleted();
			cleanup();

			/// RESIMULATE USER FILLS OUT FORM AND PROCEEDS CHECKOUT
			await setupPaymentIntentDom();

			fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));
			await new Promise(r => setTimeout(r, 4000));

			/// VERIFY NEW PAYMENT INTENT HAS BEEN CREATED
			verifyPaymentIntentCreated();

			/// GET UPDATED LOCAL STATE VALUE TO COMPARE WITH PREVIOUS VALUE 
			const refilledCart = window.localStorage.getItem("cart") as string;
			const updatedCart = JSON.parse(refilledCart) as ICart;

			expect(updatedCart.paymentIntent).toBeDefined();
			if (!updatedCart.paymentIntent) return;
			expect(updatedCart.paymentIntent).not.toStrictEqual(paymentIntent_1);
		}, 15000);


		/**
		 * After clicking payout button, a paymentIntent should be generated and stored in cart
		 *   this should trigger the rendering of the stripe payment intent in dom
		 */
		test.skip("Render Stripe payment form",
			async () => {
				/// SET INITIAL PAYMENT INTENT
				fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));
				/// await internal api queries to resolve
				///   && allow component to finish rendering
				await new Promise(r => setTimeout(r, 4000));

				expect(screen.getByTestId("#STRIPE_PAYMENT_FORM")).toBeInTheDocument();
			}, 5000);
	});
});