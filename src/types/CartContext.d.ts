import { type Dispatch, type SetStateAction } from "react";
import { type IGalleryItem } from "./Item";
import { type ICart } from "./Cart";

export declare interface ICartContext {
	cart: ICart
	setCart: Dispatch<SetStateAction<ICart>>
	openMenu: boolean
	setOpenMenu: Dispatch<SetStateAction<boolean>>
	quantity: number
	setQuantity: Dispatch<SetStateAction<number>>

	//CartContext
	addToCart: (quantity:number, item: IGalleryItem) => Promise<void>,
	removeFromCart: (item: IGalleryItem, cart: ICart) => Promise<void>,
	emptyCart: () => Promise<void>,
}

//Utils
export type addItem = (item: IGalleryItem, cart: ICart, setCart: ICartContext["setCart"], totalValue: ICartContext["totalValue"], setTotalValue: ICartContext["setTotalValue"], refetchStripeIntent: ICartContext["refetchStripeIntent"]) => void;
export type removeItem = (item: IGalleryItem, cart: ICart, setCart: ICartContext["setCart"], totalValue: ICartContext["totalValue"], setTotalValue: ICartContext["setTotalValue"], refetchStripeIntent: ICartContext["refetchStripeIntent"]) => void;
export type removeAll = (setCart: ICartContext["setCart"], refetchStripeIntent: ICartContext["refetchStripeIntent"]) => void;