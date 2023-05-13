import React from "react"
import Image from "next/image";
import images from "@/Assets";
import { type IGalleryItem } from "@/types";
import Link from "next/link";

interface CustomPageProps {
	item: IGalleryItem
    key: number
}

/**
 * This component hosts an image
 * the image is the main backgroud of the card
 * the add to cart button and price are super imposed over the item
 * the top right of the item has an arrow which can be used to flip
 * 	the item over and display text and item info on the reverse side
 */
export default function GalleryItem(props:CustomPageProps) {
	const { item } = props;

    return (
        <div className="relative h-GalleryItem w-GalleryItem mx-6 rounded-2xl bg-transparent shadow-3xl">

			{/* FRONT */}
			<Link href={`/item/${item.id}`}>
				<div className="absolute rounded-2xl h-full w-full bg-gray-200 border-Claret border-4">
					{/* MAIN ASSET FR - BACKGROUND */}
					<Image 
						src={item?.img ? item?.img: images.Logo} 
						alt="Item Image" 
						className="absolute backface-hidden"
						layout="fill"
					/>
			
				</div>
			</Link>
		</div>
    );
}