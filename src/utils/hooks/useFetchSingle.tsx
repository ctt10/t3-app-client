import { type IGalleryItem } from "@/types";
import {api} from "@/utils/api";

/**
 * do not fetch if item can be extracted from fetcheditems
 * 
 * TODO: Create an inline test in this file "describe", 
 * 	test 1 when input1 undefined, output is "... "
 * 	test 2 when input2 is undefined, output is "... "
 * 	test 3 when both defined, output is "... "
 */
export const useFetchSingle = (itemId:string|undefined, fetchedItems: IGalleryItem[]|undefined)=> {

	const {data, refetch: refetchSingle, error, isError} =	api.item.fetchSingle.useQuery({ itemId }, {
		enabled: !!itemId && !fetchedItems, 
	});

	if(isError){
		throw new Error(error?.message)
	}

	return { data, refetchSingle }
}