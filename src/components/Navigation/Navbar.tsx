import React, { useContext, useState } from "react"
import { CartContext } from "@/context/CartContext";
import Popup from "reactjs-popup";
import Image from "next/image";
import Link from "next/link";

import images from "@/Assets";
import { MobileMenu, Cart } from "@/components";
import useWindowSize from "@/utils/userWindowSize";


const Navbar: React.FunctionComponent = () => {
    //User Context
    const { cart, openMenu, setOpenMenu } = useContext(CartContext);
	const [openMobile, setOpenMobile] = useState<boolean>(false);
	const size = useWindowSize();

    const menuItems = [{
        name: "Macrame",
        link: "/gallery",
        itemType: "Macrame"
    }, {
		name: "Gemstones",
		link: "/gallery",
		itemType: "Gemstone"
	}, {
		name: "Contact",
		link: "/contact"
	}]

    return (
        <div className="flex h-32 w-full mx-auto p-5 bg-Claret shadow-xl justify-between">

			{/* LEFT SECTION */}
			<div className="flex w-full items-center justify-center gap-1">
				
				{/* Logo Image */}
				<div className="flex items-center ml-4">
					<Link 
						href="/"
					>
						<Image src={images.Logo} alt="logo" width={70} height={70}/>
					</Link>
				</div>

				{/* Menu Items */}
				<div
					className = {
						size.width !== undefined && size?.width >= 680 
							? "flex w-full items-center justify-end gap-10 mr-8"
							: "hidden"
						}
				>	
					{menuItems.map((el, i) => (
						<Link
							key={i+1}
							href={{ pathname: `${el.link}`, query: { itemType: `${el.itemType ? el.itemType : ""}` } }}
						>
							<p className="text-2xl text-white">{el.name}</p>
						</Link>
						))}
				</div>
			</div>

			{/* RIGHT SECTION */}
			<div className="flex h-full items-center justify-center mt-4 mr-12">
				{/* Cart */}
				<div 
					data-testid="#OpenCart-Button"
					className="cursor-pointer" 
					onClick={()=> {setOpenMenu(true)}}
				>
					<Image src={images.Cart} alt="logo" className="relative" width={50} height={50}/>
					{ !!cart.items && cart.items.length > 0 && (
						<div className="flex relative text-white w-8 p-1 items-center justify-center left-8 bottom-2 rounded-[50%] bg-red-500">
							{ cart.items.length }
						</div>
					)	}
				</div>

				{/* HAMBURGER MENU */}
				{size.width !== undefined && size?.width <= 680 ?
					<Image
						onClick={() => setOpenMobile(true)}
						width={50} 
						height={50}
						src={images.Hamburger} 
						alt="logo" 
						className="mb-7 ml-6 cursor-pointer" 
					/>
				: null}

			</div>

			{/* POPUP CART MENU */}
				<Popup
					open={openMenu}
					className=""
					closeOnEscape={true}
					onClose={() => (
						setOpenMenu(false)
					)}
				>
					<Cart />
				</Popup>

			{/* POPUP MOBILE MENU */}
			{openMobile &&  (
				<MobileMenu
					openMobile={openMobile}
					setOpenMobile={setOpenMobile}
					menuItems={menuItems}
				/>
			)  }
		</div>
    );
}

export default Navbar;