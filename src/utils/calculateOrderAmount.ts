import { type ICartItem } from "@/types";

/// TODO:
/// UPDATE TO FACTOR IN THE ITEM QUANTITY
export default function calculateOrderAmount(cartItems: ICartItem[]): number {
	if (!cartItems || cartItems.length < 1) return 0;

	let sum = 0;
	cartItems.map(({ item, quantity }) => {
		if (!item) return;
		//Increase cart price by cost of item multiplied by selected quantiy 
		sum += item.price * quantity;
	});

	return sum;
}