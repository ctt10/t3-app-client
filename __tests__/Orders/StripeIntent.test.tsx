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
// spy module
import * as PaymentIntentFunctions from "@/utils/hooks/StripePaymentIntentHook";
/** @data */
import { mockGalleryItem } from "../helpers/mockItemData";
import { orderFormInputValues } from "../helpers/mockOrderData";
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
	const ctx = createInnerTRPCContext({ session: null });
  	const caller = appRouter.createCaller(ctx);
	const paymentIntentSpy = vi.spyOn(PaymentIntentFunctions, "useStripePaymentIntent")
	let itemId: string; /// build && cleanup

	/// POPULATE DATABASE WITH NECESSARY VALUES FOR TESTING
	beforeAll(async () => {
		// # this also generates customerId && clientSecret
		await prisma.item.create({ data: mockGalleryItem })
        	.then((createdObj) => { itemId = createdObj.id });
    });

	/// TEST TEARDOWN, DELETE DATABASE VALUES INSERTED AT BEGINNING OF TEST 
	afterAll( async () => {
		await prisma.item.delete({
        	where: { id: itemId }
		});
    });

	describe("PaymentIntent Unit Tests", () => {
		test("Returns data undefined", async () => {
			// const data = useStripePaymentIntent(undefined);
			// await new Promise(r => setTimeout(r, 2000));
			const response = await caller.order.StripePaymentIntent({orderSubTotal: undefined});
			console.log('response', response);
			expect(response).toBeNull();
		});

		test("Returns data when number defined", async() => {
			const response = await caller.order.StripePaymentIntent({ orderSubTotal: 100 });
			console.log('response', response);
			expect(response).toBeDefined();
			expect(response?.clientSecret).toBeDefined();
			expect(response?.customerId).toBeDefined();
		});		
	});

	//for a copmlete E2E test,
	//  1. generate a stripePaymentIntent
	//  2. modify the cart to genarate new paymentIntent
	//  3. complete an order and verify that correct paymentIntent is included with order 
	describe("PaymentIntent Integration Tests", () => {

		let paymentIntent_1: StripePaymentIntent;

		/**
		 * - render single item page
		 * - add to cart
		 * - fill in checkout form
		 */
		async function setupPaymentIntentDom() {
			const { unmount } = render(<SingleItem itemId={itemId} />, { wrapper: TrpcWrapper });
			await new Promise(r => setTimeout(r, 2000));

			// ADD ITEM TO CART
			const AddButton = screen.getByTestId("#addToCart");
			fireEvent.click(AddButton);
			unmount();

			/// Render SHIPPING PAGE, POPULATE SHIPPING FORM / is localstorage preserved?
			const { getByTestId } = render(<ShippingMain />, { wrapper: TrpcWrapper });
			// unmountShipping = unmount2;
			/// SETUP ORDER FORM VALUES 
			orderFormInputValues?.map(input => {
				fireEvent.change(getByTestId(input.label), { target: { value: input.value } });
			});
		}

		function verifyPaymentIntentCreated(){
			/// VERIFY PAYMENT INTENT HAS BEEN CREATED
			const localCart = window.localStorage.getItem("cart") as string;
			expect(localCart).not.toBeUndefined();
			expect(localCart).not.toBeNull();

			const cart = JSON.parse(localCart) as ICart;
			console.log('verifyPaymentIntentCreated', cart.paymentIntent)
			expect(cart.paymentIntent).not.toBeUndefined();
			expect(cart.paymentIntent).not.toBeNull();
		}

		function verifyPaymentIntentDeleted() {
			/// CHECK PAYMENT INTENT VALUES AFTER REMOVE EVENT
			const emptiedLocal = window.localStorage.getItem("cart") as string;
			expect(emptiedLocal).not.toBeUndefined();
			expect(emptiedLocal).not.toBeNull();

			const emptiedCart = JSON.parse(emptiedLocal) as ICart;
			console.log('verifyPaymentIntentDeleted', emptiedCart)
			expect(emptiedCart.paymentIntent).toBeNull();
		}

		/**
		 * =========== [TESTS SETUP] =================
		 */
		beforeEach(async () => {
			await setupPaymentIntentDom();
		})

		/// BETWEEN TEST RESET 
		afterEach(() => {
			cleanup(); /// RTL, CLEANUP DOM
			window.localStorage.clear();
			vi.clearAllMocks();
		});

		test.skip("expect form to be populated correctly", () => {
			orderFormInputValues.map((input) => {
				expect(screen.getByTestId(input.label)?.value).toEqual(input.value);
			});
		});

		test.skip("generate stripePaymentIntent",
		 	async () => {
				fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));
				await new Promise(r => setTimeout(r, 4000));
				expect(paymentIntentSpy).toHaveBeenCalled();
				
				verifyPaymentIntentCreated();
		});

		test.skip("cart modified, payment Intent Cleared",
			async () => {
				fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));
				await new Promise(r => setTimeout(r, 4000));
				verifyPaymentIntentCreated();

				/// SIMULATE OPENNING OF CART MENU && REMOVE EVENT
				render(<CartItem item={mockGalleryItem} qty={mockGalleryItem.quantity} />, { wrapper: TrpcWrapper });
				fireEvent.click(screen.getByTestId("#RemoveFromCart"));
				verifyPaymentIntentDeleted();
		});

		test("generate stripePaymentIntent modify cart, confirm update",
			async () => {
				/// SET INITIAL PAYMENT INTENT
				fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));
				await new Promise(r => setTimeout(r, 4000));

				/// VERIFY PAYMENT INTENT HAS BEEN CREATED
				verifyPaymentIntentCreated();

				/// STORE PAYMENT INTENT IN LOCAL TEST STATE FOR LATER COMPARISON
				const localCart = window.localStorage.getItem("cart") as string;
				const cart = JSON.parse(localCart) as ICart;
				paymentIntent_1 = cart.paymentIntent as StripePaymentIntent;

				/// SIMULATE OPENNING OF CART MENU && REMOVE EVENT
				render(<CartItem item={mockGalleryItem} qty={mockGalleryItem.quantity} />, { wrapper: TrpcWrapper });
				fireEvent.click(screen.getByTestId("#RemoveFromCart"));
				verifyPaymentIntentDeleted();

				/// RESIMULATE USER FILLS OUT FORM AND PROCEEDS CHECKOUT
				cleanup();
				await setupPaymentIntentDom();

				fireEvent.click(screen.getByTestId("#SUBMIT_SHIPPING"));
				await new Promise(r => setTimeout(r, 4000));

				/// VERIFY NEW PAYMENT INTENT HAS BEEN CREATED
				verifyPaymentIntentCreated();

				/// GET UPDATED LOCAL STATE VALUE TO COMPARE WITH PREVIOUS VALUE 
				const refilledCart = window.localStorage.getItem("cart") as string;
				const updatedCart = JSON.parse(refilledCart) as ICart;
				console.log('updatedCart', updatedCart)
				console.log('paymentIntent_1', paymentIntent_1)

				expect(updatedCart.paymentIntent).toBeDefined();
				if (!updatedCart.paymentIntent) return;
				expect(updatedCart.paymentIntent).not.toStrictEqual(paymentIntent_1);
		}, 15000);


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
});