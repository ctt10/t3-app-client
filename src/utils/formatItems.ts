import { type Item } from '@prisma/client'
import { type IGalleryItem } from "@/types";

/**
 * //format data from @prisma "Item" type to IGalleryItem type
 */
export default function formatItems(items: Item[]):IGalleryItem[] {	
	const formattedItems: IGalleryItem[] = [];
	items.map(item => {
		const { id, name, media, theme, price, itemType, subType, quantity, description, createdAt } = item;
		formattedItems.push({
			id, name, media, theme, price, itemType, subType, description, quantity,
			createdAt: new Date(createdAt).toISOString()
		});
	});

	return formattedItems;
}