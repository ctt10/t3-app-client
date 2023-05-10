import { type ICart, type IGalleryItem } from "@/types";

export default function incrementItems(cart: ICart, item: IGalleryItem, quantity: number): ICart {
	{/* UPDATE CART ITEM QUANTITY */ }
	return {
		items: [...cart.items, { item, quantity }],
		totalPrice: cart.totalPrice + item.price
	}
}