import React, { useEffect, useState, createContext } from "react";
import { type IItemContext } from "@/types";
import { useFetchSingle } from "@/utils/hooks/useFetchSingle";
import { useFetchTheme } from "@/utils/hooks/useFetchTheme";
import { useFetchType } from "@/utils/hooks/useFetchType";

/**
 * This Context is used to collect shipping information from user
 * 	and call server function to 
 */
export const ItemContext = createContext<IItemContext>({} as IItemContext);

export const ItemContextProvider = ({ children }: { children: React.ReactNode }) => {

	//QUERY OPTIONS 
	const [itemType, setItemType] = useState<IItemContext['itemType']>(undefined);
	const [theme, setTheme] = useState<IItemContext["theme"]>(undefined);
	const [itemId, setItemId] = useState<IItemContext["itemId"]>(undefined);
	const [fetchedItems, setFetchedItems] = useState<IItemContext["fetchedItems"]>(undefined);
	const [fetchedItem, setFetchedItem] = useState<IItemContext["fetchedItem"]>(null);

	const { data: singleItem, refetchSingle } = useFetchSingle(itemId, fetchedItems);
	const { data: itemsByTheme, refetchTheme } = useFetchTheme(theme);
	const { data: itemsByType, refetchType } = useFetchType(itemType);


	useEffect(() => {
		const fetchSingle = async () => {
			await refetchSingle();
		}
		const fetchTheme = async () => {
			await refetchTheme();
		}

		const fetchType = async () => {
			await refetchType();
		}

		if (!!itemId) { fetchSingle() }
		if (!!theme) { fetchTheme() }
		if (!!itemType) { fetchType() }

	}, [itemId, theme, itemType, refetchSingle, refetchTheme, refetchType])

	useEffect(() => {
		if (!!singleItem) {
	      setFetchedItem(singleItem);
		}

		if (!!itemsByTheme) {
			setFetchedItems(itemsByTheme)
		}

		if (!!itemsByType) {
			setFetchedItems(itemsByType)
		}
	}, [setFetchedItems, setFetchedItem, singleItem, itemsByTheme, itemsByType])


	return (
		<ItemContext.Provider
			value={{
				itemType,
				setItemType,

				theme,
				setTheme,

				itemId,
				setItemId,

				fetchedItem,
				fetchedItems
			}}
		>
			{children}
		</ItemContext.Provider>
	);
}