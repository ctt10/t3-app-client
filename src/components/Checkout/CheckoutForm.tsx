import { useState, useContext, type FormEvent } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import Image from "next/image";
import images from "@/Assets";
import { CartContext } from "@/context/CartContext";
import { OrderContext } from "@/context/OrderContext";

import { api } from "@/utils/api";
import { env } from "@/env.mjs";

export default function CheckoutForm() {

    const stripe = useStripe();
    const elements = useElements();

    const { setOpenStripe, shippingInfo } = useContext(OrderContext);
    const { cart } = useContext(CartContext);
    
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const createOrderMutation = api.order.create.useMutation();

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!stripe || !elements|| !shippingInfo || !cart || !cart.items || !cart.paymentIntent?.customerId) {
            // disable form submission until Stripe checkout completely ready
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${env.NEXT_PUBLIC_HOST_NAME}/order_successful`,
                receipt_email: shippingInfo.email,
            },
        }).then( () => {
            try{
                if (!!cart.items && !!cart.paymentIntent && !!cart.paymentIntent.customerId) {
                    createOrderMutation.mutate({ shippingInfo, items: cart.items, customerId: cart.paymentIntent.customerId });
                } else {
                    throw new Error('Order Invalid')
                }
            }catch(err){
                console.error(err)
                throw new Error('Order Creation Failed')
            }
        })
        

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // the `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error?.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    return (
      <form 
        className="absolute bg-red-300 p-10 rounded-2xl"
        id="payment-form" 
        data-testid="#STRIPE_PAYMENT_FORM"
        onSubmit={(e)=> handleSubmit(e)}
      >
        {/* Close Modal */}
        <div className="flex justify-end h-full w-full">
          <div 
            className="flex justify-center w-10 rounded-[50%] border-2 p-1.5 mb-2 cursor-pointer" 
            onClick={()=> setOpenStripe(false)}
          >
            <Image src={images.Cross} alt="X" width={30} height={30}/>
          </div>
        </div>
        <PaymentElement id="payment-element" data-testid="#payment-element" options={paymentElementOptions} />
        <button 
          className="w-full h-full bg-blue-600 mt-5 py-2 text-white font-bold"
          disabled={isLoading || !stripe || !elements} 
          id="submit"
        >
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    );
}