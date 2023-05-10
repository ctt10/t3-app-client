import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import calculateOrderAmount from "@/utils/calculateOrderAmount";
import { CartContext } from "@/context/CartContext";
import { useStripePaymentIntent } from "@/utils/hooks/StripePaymentIntentHook"

/** @types */
import { type ICart, type IOrderContext } from "@/types";

/**
 * This Context is used to collect shipping information from user
 * 	and call server function to 
 */
export const OrderContext = createContext<IOrderContext>({} as IOrderContext);

export const OrderContextProvider = ({ children }:{children: ReactNode}) => {
	
	const { setCart } = useContext(CartContext);
	
	// ORDER VARS
	const [shippingInfo, setShippingInfo] = useState<IOrderContext['shippingInfo']>(null)
	const [message, setMessage] = useState<string>("");	
	
	const [openStripe, setOpenStripe] = useState<boolean>(false);
	const [orderSubTotal, setOrderSubTotal] = useState<number|undefined>(undefined);

	const { data: paymentIntent, refetchPaymentIntent } = useStripePaymentIntent(orderSubTotal);

	async function prepStripeCheckout(cart: ICart) {
		if (!refetchPaymentIntent || !cart || cart.items?.length < 0) return;
		// if (!orderSubTotal) return;
		setOrderSubTotal(calculateOrderAmount(cart.items));
		await refetchPaymentIntent();
	} 

	useEffect(()=> {
		if (!!paymentIntent) {
			const cartItems = localStorage.getItem("cart");
			if (!cartItems) return;

			const cartData = JSON.parse(cartItems) as ICart;
			cartData.paymentIntent = paymentIntent;
			localStorage.setItem("cart", JSON.stringify(cartData));

			/// this value is reset to undefined, to force refresh of value
			/// on further submissions of checkout form
			setCart(cartData);
			setOrderSubTotal(undefined);
			//Proceed checkout flow
			setOpenStripe(true);
		}
	},[paymentIntent, setCart, setOrderSubTotal, setOpenStripe])

	return (
		<OrderContext.Provider
			value={{
				//payment completion status
				message,
				setMessage,

				// Order Info
				shippingInfo,
				setShippingInfo, 

				// Stripe
				prepStripeCheckout,

				openStripe,
				setOpenStripe,
			}}
		>
			{children}
		</OrderContext.Provider>
	);
}