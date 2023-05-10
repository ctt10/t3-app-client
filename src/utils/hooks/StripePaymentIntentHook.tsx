import {api} from "@/utils/api";

/**
 * @notice
 * 	fetching of this api endpoint is only triggered when user submits
 * 		shippingInfo form
 * @notice this is called multiple times, once each render
 */
export const useStripePaymentIntent = (orderSubTotal: number|undefined) => {
	console.log('useStripePaymentIntent ==================');
	console.log('orderSubTotal', orderSubTotal)
	const { data, isLoading, isError, error, refetch: refetchPaymentIntent } = api.order.StripePaymentIntent.useQuery({ orderSubTotal }, {
		enabled: !!orderSubTotal, //no fetch default
	});

	console.log('data', data)
	console.log('isLoading', isLoading)
	console.log('isError', isError)
	console.log('error XXXX', error?.message)
	if (isError) throw new Error(error?.message)

	return { data, refetchPaymentIntent };
}

// export function paymentIntentHook(orderSubTotal: number | undefined) {
// 	return 
// }