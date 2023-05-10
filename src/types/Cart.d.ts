import { type IGalleryItem } from "./Item";

export type ItemQuantity = number; 

export declare interface ICartItem {
	item: IGalleryItem | null | undefined
	quantity: number
}

export declare interface ICart {
	items: ICartItem[]
	paymentIntent: StripePaymentIntent | null
	totalPrice: number,
}

export declare interface StripePaymentIntent {
	clientSecret: string | null;
	customerId: string | null;
}
