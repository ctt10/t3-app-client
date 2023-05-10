import React, { useContext } from "react"
import Image from "next/image"
import numeral from "numeral";
import images from "@/Assets";
import { CartContext } from "@/context/CartContext";
import { type IGalleryItem } from "@/types";

interface CustomPageProps {
	item: IGalleryItem
	qty: number
}
/**
 * This component is nested inside Cart
 * 	Displays info for single Cart Item
 */
const CartItem = (props: CustomPageProps) => {
    const { item, qty } = props;
	const { cart, removeFromCart } = useContext(CartContext);

    if (cart.items.length === 0 || item === undefined) return null;
    return (
        <div data-testid="#CartItem" className="w-full border-b-2 p-4"> 
			{	!!item && (
                <div className="relative flex h-32 w-full items-center justify-center"> 
						{/* LEFT */}
						<div className="flex w-1/2 items-center justify-center p-2 ml-4">
							<Image
								src={item.img ? item.img : images.Logo}
								className="border-b-2"
								alt="Item"
								height={130}
								width={130}
							/>
						</div>

						{/* RIGHT */}
						<div className="flex flex-col h-full w-1/2">
							{/* QUANTITY */}
							<span className="flex text-xl items-start justify-end">
								<b className="mr-3">
									Qty:
								</b> {qty}
							</span>

							{/* INFO CONTAINER */}
							<div className="flex h-full w-full justify-start items-end">
								
								{/* INFO */}
								<div className="w-full">
								
									{/* PRICE */}
									<span
										data-testid={"#CartItemPrice"}
										className="flex w-full underline"
									>
										{numeral(item.price).format("$0.00")}
									</span>
								</div>

								{/* REMOVE ITEM */}
								<div
									className="flex w-full justify-end items-center hover:text-red-500 underline cursor-pointer"
									onClick={() => removeFromCart(item, cart)}
									data-testid="#RemoveFromCart"
								>
									Remove
								</div>
							
							</div>
						</div>
					</div>
            )	} 
       </div>
    );
}

export default CartItem;