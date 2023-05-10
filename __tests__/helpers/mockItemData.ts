import { type IGalleryItem, type CreateItemInputParams, type ICartItem, type CreateOrderInputParams } from "@/types";
import { v4 as uuidV4 } from "uuid";
'polygon(100% 100%, 0% 100%, 0% 0%)'
import { galleryThemes } from '@/utils/constants/galleryThemes'

export const itemTypes = ["Macrame", "Gemstone"];
export const MacrameSubTypes = ["Necklace","Bracelet","Ring","Forehead","Waist"];
export const GemstoneSubTypes = ["Amethysz","Azurite","Garnet","Herkimer Diamond","Quarts"];


export const mockItems: CreateItemInputParams[] = [{
  name: "client test item 1",
  media: ["", ""],
  theme: galleryThemes[0] as string,
  description:"this is a test item created in client tests",
  price:200,
  itemType:"Macrame",
  subType: "Necklace",
  quantity: 1,
},{
  name: "client test item 2",
  media: ["", ""],
  theme: galleryThemes[1] as string,
  description: "this is a test item created in client tests",
  price:75,
  itemType:"Macrame",
  subType: "Bracelet",
  quantity: 1,
}];

export const mockOrderItems: ICartItem[] = [{
  quantity: 1,
  item: {
    id: uuidV4(),
    name: "test order item 1",
    media: [""],
    theme: galleryThemes[0] as string,
    price: 80,
    itemType: "Macrame",
    subType: "Bracelet",
    quantity: 1,
    description: "THIS IS A TEST DESCRIPTION OF AN ITEM",
    createdAt: new Date().toISOString()
  },
}, {
  quantity: 1,
  item: {
    id: uuidV4(),
    name: "test order item 2",
    media: [""],
    theme: galleryThemes[1] as string,
    price: 50,
    itemType: "Macrame",
    subType: "Bracelet",
    quantity: 1,
    description: "THIS IS A TEST DESCRIPTION OF AN ITEM",
    createdAt: new Date().toISOString()
  }
}];

export const mockGalleryItem: IGalleryItem = {
  id: uuidV4(),
  name: "Test Gallery Item One",
  media: ["https://TestImageUrl.com"],
  theme: galleryThemes[0] as string,
  price: 150,
  itemType: "Macrame",
  subType: "Bracelet",
  quantity: 1,
  description: "This is a descirption of a Test Gallery Item",
  createdAt: new Date().toISOString(),
};