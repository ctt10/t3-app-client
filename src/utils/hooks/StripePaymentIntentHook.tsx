import {api} from "@/utils/api";

/**
 * @notice
 * 	fetching of this api endpoint is only triggered when user submits
 * 		shippingInfo form
 * @notice this is called multiple times, once each render
 */
export const useStripePaymentIntent = (orderSubTotal: number|undefined) => {
	const { data, isError, error, refetch: refetchPaymentIntent } = api.order.StripePaymentIntent.useQuery({ orderSubTotal }, {
		enabled: !!orderSubTotal, //no fetch default
	});

	if (isError) throw new Error(error?.message)

	return { data, refetchPaymentIntent };
}