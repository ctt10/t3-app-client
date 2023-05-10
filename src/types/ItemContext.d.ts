import { type Dispatch, type SetStateAction } from "react";
import { type IGalleryItem } from "./Item";

export declare interface IItemContext {
	itemId: string | undefined
	setItemId: Dispatch<SetStateAction<string | undefined>>

	itemType: string | undefined
	setItemType: Dispatch<SetStateAction<string|undefined>>

	theme: string | undefined
	setTheme: Dispatch<SetStateAction<string|undefined>>

	fetchedItem: IGalleryItem | null
	fetchedItems: IGalleryItem[] | undefined
}