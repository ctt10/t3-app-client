//TESTING UTILS
import { describe, expect, test, vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, renderHook } from "@testing-library/react";
// DB
import { prisma } from "@/server/db";
// import { PrismaClient } from '@prisma/client';

/**@data */
import { mockGalleryItem } from "../helpers/mockItemData";
import { orderFormInputValues } from "../helpers/mockOrderData";

/// API REQUEST MODULE
 	// spy import
import * as PaymentIntentFunctions from "@/utils/hooks/StripePaymentIntentHook";
	// mock import
import { useStripePaymentIntent } from "@/utils/hooks/StripePaymentIntentHook";

/// APP SETUP UTILS
import { TrpcWrapper } from "../helpers/decorator";

/// COMPONENTS IN TEST
import { SingleItem, ShippingMain, CartItem } from "@/components";
/** @types */
import { type ICart } from '@/types';

/**
 * Setup Requirements:
 * 	- Nextjs trpc app requires a wrapper implemented using react trpc client 
 * 	- Trpc client is required to encase App component to test, including all Context providers
 *  - If 	
 */

vi.mock("@/utils/hooks/StripePaymentIntentHook", () => {
	return {
		useStripePaymentIntent: vi.fn(() => {
			return {
				data: undefined,
				refetchPaymentIntent: vi.fn(),
			}	
		})
	}	
});

describe("Generate Stripe payment Intent", () => {
	
	// const prismaMock = mockDeep<PrismaClient>();

	/// TEST GLOBALS;
	let itemId: string; /// build && cleanup

	const paymentIntentSpy = vi.spyOn(PaymentIntentFunctions, "useStripePaymentIntent")

	let unmountShipping: () => void;
	/**
	 * WHAT TESTS ARE ABSOLUTE MUST
	 * - MOCKED VALUES AND FUNCTIONS ARE SETUP CORRECTLY
	 * - STRIPE PAYMENT INTENT IS GENERATED WHEN CHECKOUT REQUEST WITH ITEM IN CART
	 * - NEW STRIPE PAYMENT INTENT IS GENERATED WHEN CART UPDATED (payment intent is specific to amount)
	 */

	/// POPULATE DATABASE WITH NECESSARY VALUES FOR TESTING
	beforeAll(
   		async () => {
	      // # this also generates customerId && clientSecret
	      await prisma.item.create({ data: mockGalleryItem })
	        .then((createdObj) => { itemId = createdObj.id });
    });


	/// BETWEEN TEST RESET 
	// afterEach(() => {
    //  	cleanup(); /// RTL, CLEANUP DOM
	//     window.localStorage.clear();
	//     console.log('cleared localstorage', window.localStorage.getItem("cart"))
	//     vi.clearAllMocks();
    // });

	/// TEST TEARDOWN, DELETE DATABASE VALUES INSERTED AT BEGINNING OF TEST 
	afterAll(
    	async () => {
	      await prisma.item.delete({
	        where: { id: itemId }
	      });
    });

	/// while rendering the hook is called several times (useMemo...)
	/// TODO: useMemo() to limit requests
	/// UNIT TEST
	describe("PaymentIntent Input, orderSubTotal = undefined", () => {

		///SIMULATE USER ACTIONS LEADING UP TO REQUEST STRIPE PAYMENT INTENT
		
		beforeEach(
			 () => {

				/// RENDER USER STARTING SCREEN  
				render(<SingleItem itemId={itemId} />, { wrapper: TrpcWrapper });
				// const { unmount } = render(<SingleItem itemId={itemId} />, { wrapper: TrpcWrapper });

				///	TODO: PRISMA MOCK TO REMOVE WAIT TIME
				/// await internal api requests
				// await new Promise(r => setTimeout(r, 2000));

				// // ADD ITEM TO CART
				// const AddButton = screen.getByTestId("#addToCart");
				// fireEvent.click(AddButton);
				// unmount();

				// /// Render SHIPPING PAGE, POPULATE SHIPPING FORM / is localstorage preserved?
				// const { unmount: unmount2, getByTestId } = render(<ShippingMain />, { wrapper: TrpcWrapper });
				// unmountShipping = unmount2;

				// /// SIMULATE FILL IN ORDER INFO FORM 
				// orderFormInputValues?.map(input => {
				// 	fireEvent.change(getByTestId(input.label), { target: { value: input.value } });
				// })
		});

		/// BETWEEN TEST RESET 
		afterEach(() => {
			cleanup(); /// RTL, CLEANUP DOM
			window.localStorage.clear();
			vi.clearAllMocks();
		});

		test("Returns data undefined", async () => {
			const rendered = renderHook(useStripePaymentIntent);
			console.log('rendered', rendered);
			const { result } = renderHook(useStripePaymentIntent);
			console.log('result', result.current);
			console.log('result', result.current.data);

			// const data = result.;
			await new Promise(r => setTimeout(r, 2000));
			
			expect(useStripePaymentIntent).toHaveBeenCalledTimes(1);
			// console.log('data', data);
			// expect(data?.data).toBe(undefined);
		});

		test("Returns data when given number", async() => {
			const data = useStripePaymentIntent(100);
			await new Promise(r => setTimeout(r, 2000));

			console.log('data', data);
			expect(useStripePaymentIntent).toHaveBeenCalledTimes(1);
			expect(useStripePaymentIntent).toHaveBeenCalledWith(100);

			expect(data?.data).toBeDefined();
			expect(data.data).not.toEqual(null);
		});

		test.skip("stripe payment request hook is called", () => {

			/// CALL THE IMPORTED FUNCTION WITH A NUMBER
			
		    //HAS FUNCTION DIRECTLY TRIGGERING API REQUEST BEEN CALLED? WITH WHAT VALUE?
		    expect(useStripePaymentIntent).toHaveBeenCalled();

		    const componentRenderCount = 6;
		    expect(useStripePaymentIntent).toHaveBeenNthCalledWith(componentRenderCount, mockGalleryItem.price);

		    /// VERIFY PAYMENT INTENT HAS BEEN CREATED
		    const localCart = window.localStorage.getItem("cart") as string;
		    expect(localCart).not.to.equal(null);
		    if (!localCart) return;
		    const cart = JSON.parse(localCart) as ICart;
		    expect(cart.paymentIntent).toBeDefined();	
		});
	  	

		/**
		 * instead of a spy, need to create a mock implementation where I can set the input values
		 *  then observe the expected outptu
		 */












		
	});

	describe("", () => {
		

		test.skip("expect form to be populated", () => {
		    orderFormInputValues.map((input) => {
		        expect(screen.getByTestId(input.label)?.value).toEqual(input.value);
		    });
		});
	});
});