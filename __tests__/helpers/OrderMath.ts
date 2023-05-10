import { type ICartItem, type CreateItemInputParams } from "@/types";

// export declare interface ICartItem {
//   item: IGalleryItem | null | undefined
//   quantity: number
// }

export function CalcOrderTotal(items: ICartItem[]): number {
  let total = 0;
  items.map(({ item }) => {
    if(!!item) total += item.price * item.quantity;
  })
  return total;
}

export function PreCalcOrderTotal(items: CreateItemInputParams[]):number {
  let total = 0;
  items.map(item => {
    total += item.price * item.quantity;
  })
  return total;
}