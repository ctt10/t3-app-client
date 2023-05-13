import { api } from "@/utils/api";
// import { type ItemType } from "@/types";

export const useFetchType = (itemType: string|undefined) => {
	// THEME GALLERY QUERY 
	const { data, refetch: refetchType, isError, error } = api.item.fetchByType.useQuery({ itemType }, {
		enabled: !!itemType,
	});

	if (isError) {
		throw new Error(error?.message)
	}

	return { 
		data: !!data ? data: null, 
		refetchType 
	}
}