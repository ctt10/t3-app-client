import { type Dispatch, type SetStateAction } from "react";
import { type IShippingForm, type ICart } from "@/types";
	

export declare interface IOrderContext {
	shippingInfo: IShippingForm|null
	setShippingInfo: Dispatch<SetStateAction<IShippingForm|null>>

	message: string,
	setMessage: Dispatch<SetStateAction<string>>

	prepStripeCheckout: (cart: ICart) => Promise<void>,

	openStripe: boolean
	setOpenStripe: Dispatch<SetStateAction<boolean>>
}