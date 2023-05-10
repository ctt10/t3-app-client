import { type OrderItem, type ICartItem, type IGalleryItem, type PrismaItemId } from "@/types";
import { type Item as PrismaItem } from "@prisma/client";

export default function extractItemIds(items: (PrismaItem | OrderItem | ICartItem)[]): PrismaItemId[] {
  const ids: PrismaItemId[] = [];
    for (const i of items) {
      if(!i.id) break
      ids.push({ id: i.id });
    }
    
  return ids;
}