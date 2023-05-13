import React from "react";
import images from "@/Assets";
import Image from "next/image";
import Link from "next/link";
import { type Dispatch, type SetStateAction } from "react";

interface CustomPageProps {
    openMobile: boolean,
    setOpenMobile: Dispatch<SetStateAction<boolean>>
    menuItems: {name:string, link:string}[]
}

{/* POPUP MOBILE MENU */}
export default function MobileMenu(props:CustomPageProps) {

	const { openMobile, setOpenMobile, menuItems } = props;
	if (!openMobile) return null;
	
	return (
		<div className="flex flex-col absolute left-0 z-50 pt-40 h-screen w-full bg-black py-5 items-center justify-start gap-y-10">
			<Image 
				src={images.WhiteCross}
				alt="Close"
				height={50}
				width={50}
				onClick={ ()=> setOpenMobile(false) }
				className="absolute right-10 top-0 cursor-pointer"
			/>
			{menuItems.map((el, i) => (
				<Link
					key={i + 1}
					href={{ pathname: `${el.link}` }}
					onClick={() => setOpenMobile(false) }
				>
					<p className="text-2xl text-white">{el.name}</p>
				</Link>
			))}
		</div>
	);
}