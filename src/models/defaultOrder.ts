import {type IOrderContext} from "@/types";

export const defaultOrderContext:IOrderContext = {
	message: "",
	setMessage: () => {},
	totalPrice: 0,
	setTotalPrice: () => {},
	ShippingForm: null,
	
	paymentMethod: "",
	openStripe: false,
	setOpenStripe: () => {},
	openPaypal: false,
	setOpenPaypal: () => {},
}