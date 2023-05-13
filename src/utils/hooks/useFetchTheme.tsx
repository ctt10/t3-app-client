import { api } from "@/utils/api";

export const useFetchTheme = (theme:string|undefined) => {
	// THEME GALLERY QUERY 
	const {data, refetch:refetchTheme, isError, error} = api.item.fetchByTheme.useQuery({ theme }, {
		enabled: !!theme,  //do not fetch by default
	});

	if(isError) {
		throw new Error(error?.message)
	}

	return { 
		data: !!data ? data : null,
		refetchTheme
	}
}