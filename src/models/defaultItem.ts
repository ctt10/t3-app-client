import { type IGalleryItem } from "@/types";

export const defaultItem: IGalleryItem = {
	id:"",
	name:"",
	img: null,
	media: undefined,
	theme: "",
	price:0,
	quantity: 1,
	itemType: "",
	subType: "",
	description:"",
	createdAt: new Date()
}