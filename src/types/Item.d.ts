import { type inferProcedureInput, type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";

export type PrismaItemId = { id: string };

export type ItemId = string | null;
export type ItemName = string | null;
export type ItemImg = File | string | null;
export type ItemTheme = string | null;
export type ItemMediaLocation = string[] | null;
export type ItemPrice = number | null;
export type ItemType = "Macrame" | "Gemstone";
export type ItemSubType = MacrameSubType | GemstoneSubType
export type MacrameSubType = "Necklace" | "Bracelet" | "Ring" | "Forehead" | "Waist";
export type GemstoneSubType = "Amethysz" | "Azurite" | "Garnet" | "Herkimer Diamond" | "Quarts";
export type GalleryTheme = "Winter" | "Fire" | "Time" | "Fairy" | "Meow" | "Everything";
export type ItemDescription = string | null;
export type ItemCreatedAt = string | null; //new Date().toISOString(),

export declare interface IGalleryItem {
  id: string
  name: string 
  img?: StaticImageData | string
  theme: string
  media: string[] //urls to videos or images
  price: number
  itemType: string
  subType: string
  quantity: number
  description: string
  createdAt: string
}

export declare interface OrderItem extends IGalleryItem {
  orderId: string | null
}

//TRPC Creates dynamic typings that are more easily maintainable
export type FetchAllItemInputParams = inferProcedureInput<AppRouter["item"]["fetchAll"]>;
export type FetchAllItemOutputParams = inferProcedureOutput<AppRouter["item"]["fetchAll"]>;

export type CreateItemInputParams = {
  description: string;
  name: string;
  media: string[];
  theme: string;
  price: number;
  itemType: string;
  subType: string;
  quantity: number;
}

type DeleteItemInputParams = {
  itemId: string;
}

type FetchItemOutputParams = {
  itemId: string;
}

type CreateItemOutputParams = {
  description: string;
  name: string;
  img: string;
  price: number;
  itemType: string;
  subType: string;
  quantity: number;
}

type DeleteItemOutputParams = {
  itemId: string;
}