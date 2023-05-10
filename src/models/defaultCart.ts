import { type ICart} from "@/types";

export const defaultCart: ICart = {
	items: [],
	paymentIntent: null,
	totalPrice: 0
}

export const defaultCartContext = {
	openMenu: false,
	setOpenMenu: () => false,
	cart: defaultCart,
	setCart: () => [],
}