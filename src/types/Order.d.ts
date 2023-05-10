import { type inferProcedureInput, type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";
import { type OrderItem } from "@/types";

export type OrderId = string | null;
export type OrderEmail = string | null;
export type OrderFirstName = string | null;
export type OrderLastName = string | null;
export type OrderCountry = string | null;
export type OrderStateProvince = string | null;
export type OrderCity = string | null;
export type OrderAddressline = string | null;
export type OrderAddressline2 = string | null;
export type OrderZipcode = string | null;
export type OrderPhoneNumber = string | null;
export type OrderItems = OrderItem[];
export type OrderPaymentMethod = "Stripe" | "Paypal";
export type OrderTotalPrice = number | null;
export type OrderShipped = boolean | null;
export type OrderReceived = boolean | null;
export type OrderCreatedAt = Date | null;

type IOrder = BaseOrderWithShipping & OrderItem; 

export declare interface IShippingForm {
	email: string
	firstName: string
	lastName: string
	country: string
	stateProvince: string
	city: string
	addressOne: string
	addressTwo: string
	zipCode: string
	phoneNumber: string
}


export declare interface BaseOrder extends IShippingForm {
	totalPrice: number | null
	paymentId?: string
	customerId?: string
	idempotencyKey?: string
	receiptUrl?: string
	paymentStatus?: string
	createdAt: Date | null
}

export declare interface BaseOrderWithItems extends BaseOrder {
	items: OrderItem[]
}

export declare interface BaseOrderWithShipping extends BaseOrder {
	shipped: boolean | null
	received: boolean | null
}

//TRPC Creates dynamic typings that are more easily maintainable
export type FetchOrderInputParams = inferProcedureInput<AppRouter["order"]["fetchOne"]>;
export type FetchAllOrderInputParams = inferProcedureInput<AppRouter["order"]["fetchAll"]>;
export type UpdateOrderInputParams = inferProcedureInput<AppRouter["order"]["update"]>;
export type DeleteOrderInputParams = inferProcedureInput<AppRouter["order"]["delete"]>;

export type FetchOrderOutputParams = inferProcedureOutput<AppRouter["order"]["fetchOne"]>;
export type FetchAllOrderOutputParams = inferProcedureOutput<AppRouter["order"]["fetchAll"]>;
export type UpdateOrderOutputParams = inferProcedureOutput<AppRouter["order"]["update"]>;
export type DeleteOrderOutputParams = inferProcedureOutput<AppRouter["order"]["delete"]>;

export type CreateStripePaymentIntentParams = inferProcedureInput<AppRouter["order"]["StripePaymentIntent"]>
export type CreateOrderInputParams = inferProcedureInput<AppRouter["order"]["create"]>