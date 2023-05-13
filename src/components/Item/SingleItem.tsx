import React from "react";
import { useEffect, useState, useContext } from "react";
import numeral from "numeral";

import { ImageCarousel } from "@/components";

/** @Context */
import { CartContext } from "@/context/CartContext";
import { ItemContext } from "@/context/ItemContext";
import { type IGalleryItem } from "@/types";

interface CustomPageProps {
	itemId: string|string[]
}

export default function SingleItem(props: CustomPageProps) {
	
	const { itemId }  = props; 
	const { quantity, setQuantity, addToCart } = useContext(CartContext);
	const { fetchedItem, fetchedItems, setItemId } = useContext(ItemContext);

	/**
	 * @notice
	 * Display item can be from prefetched fetchedItems, 
	 * 	or fetchedItem from fallback query
	 */ 
	const [displayItem, setDisplayItem] = useState<IGalleryItem|null>(null);

	/**
	 * Attempt to use data already pulled from server first, 
	 * 	extract item from list of items already present in gallery. 
	 * 
	 * If item is not present (refresh, or navigating to specific item page directly)
	 * 	a fallback query is triggered to fetch data
	 */
	useEffect(() => {
		if (!!fetchedItem){ setDisplayItem(fetchedItem) }
		//filter through both lists to attempt to find item with matching id, if both fail, refetch
		const item = fetchedItems?.filter(item => item.id === itemId)[0];
		if(!!item){
			setDisplayItem(item);
		} else {
			{/* trigger fallback query */}
			setItemId(itemId as string);
		}		
	}, [itemId, setItemId, fetchedItems, fetchedItem])

	return ( 
		<div className="flex flex-col h-full w-3/4 items-center justify-center p-5 rounded-xl items-center justify-center bg-DarkPeriwinkle rounded-xl">
		{/* CONTAINER TOP */ }
		<div className="flex h-full w-full m-4 pr-6">

			{/* CONTAINER TOP LEFT */ }
			<div className="mt-10 mx-5" >
				{/* MEDIA DISPLAY */ }
					<ImageCarousel itemImages={displayItem?.media ? displayItem.media : [""]} />
			</div>

			{/* CONTAINER TOP RIGHT */ }
			< div className = "flex flex-col h-GalleryItem w-full bg-white rounded-lg p-5 mt-10 border-2 border-Grape" >

				{/* ITEM INFO CONTAINER */ }
				<div className = "flex flex-col h-full w-full gap-y-6 text-xl" >
					<p>
						<b className="font-CocoBiker text-2xl text-black mr-2">
							Item:
						</b> 
							{displayItem?.name}
					</p>
					<p>
						<b className="font-CocoBiker text-2xl text-black mr-2">
							Apparel Type:
						</b>
					</p>
					<p>
						<b className="font-CocoBiker text-2xl text-black mr-2">
							Stones:
						</b>
					</p>
					<p>
						<b className="font-CocoBiker text-2xl text-black mr-2">
							Threads:
						</b>
					</p>
					<p>
						<b className="font-CocoBiker text-2xl text-black mr-2">
							Size:
						</b>
					</p>
				</div >

				{/* CART BUTTON */ }
				<div className = "flex w-full justify-end mr-10 pt-4 font-bold items-center" >
					<p className="flex h-full w-full p-2 max-h-[3rem] max-w-[6rem] text-black items-center justify-center text-xl">
							{numeral(displayItem?.price).format("$0,0.00")}
					</p>

					{/* QUANTITY SELECT */ }
					<input 
						type='number' 
						value={!!quantity ? quantity: 1}
						disabled={displayItem?.itemType === "Macrame" ? true : false}
						className="flex h-10 w-40 p-4 border-2 border-Grape m-2 rounded-lg"
						onChange={(e) => { setQuantity( Number(e.target.value)) }} 
					/>
					
					<button
						className="h-10 w-28 bg-MintGreen border-Grape border-2 rounded-2xl cursor-pointer"
						onClick={() => addToCart(quantity, displayItem)}
						disabled={!displayItem}
						data-testid="#addToCart"
					>
						Add to Cart
					</button>
				</div>
			</div>
		</div>

		{/* CONTAINER BOTTOM */ }
		< div className = "flex h-96 w-full bg-DarkPeriwinkle justify-center items-center text-left" >
			{/*ITEM DESCRIPTION CONTAINER*/ }
			< p className = "flex h-80 w-full mx-10 p-10 rounded-lg font-CocoBiker text-2xl border-2 border-Grape bg-white" >
					{displayItem?.description}
				</p >
			</div >
		
		</div >
	);
}