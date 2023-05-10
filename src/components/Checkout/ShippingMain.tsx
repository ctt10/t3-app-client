import { useContext } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from "@stripe/react-stripe-js";

import { OrderSummary, ShippingInfo, CheckoutForm } from "@/components"
import { OrderContext } from "@/context/OrderContext";
import { CartContext } from "@/context/CartContext";
import { env } from "@/env.mjs";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

/**
 * 1. collect customer shipping information in ShippingInfo section
 * 2. Upon validation of all input fields, customer submits form
 * 3. If inputs valid, display popup form with Stripe or Paypal payout form
 */
export default function ShippingMain() {

    //FETCH DATA REQUEST
    const { openStripe } = useContext(OrderContext);
    const { cart } = useContext(CartContext);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret: cart.paymentIntent?.clientSecret,
        appearance,
    };

    return (
        <div className="flex flex-wrap h-full w-full items-center justify-center p-12 max-w-[1150px] bg-Claret rounded-xl">
            <h1 className="flex text-4xl font-bold text-white w-full bg-Claret pt-4 justify-center ">
                Checkout Form
            </h1>

            <div className="inline-flex items-center justify-between h-full w-full p-4 bg-Claret">
                <ShippingInfo />
                <div className="bg-MintGreen rounded-lg">
                    <OrderSummary />
                </div>
                { openStripe && !!cart.paymentIntent && (
                    <div className="flex absolute h-full w-full items-center justify-center bg-opacity-80 bg-white">
                        <Elements options={options} stripe={stripePromise}>
                          <CheckoutForm />
                        </Elements>
                    </div>
                ) }
            </div>
        </div>
    );
}