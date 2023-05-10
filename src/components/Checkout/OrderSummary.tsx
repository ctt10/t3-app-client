import { useContext } from 'react';
import { CartContext } from "@/context/CartContext";
import { type ICartItem } from "@/types"
import numeral from "numeral";
import Image from "next/image";
import images from "@/Assets";

/**
 * This commponent takes the cart component and displays information about the customer's order
 *  alongside the Shipping info collection
 */
export default function OrderSummary() {

    const { cart } = useContext(CartContext);

	return (
        <div className="flex flex-col justify-start h-[1085px] w-96 m-5 bg-white overflow-y-scroll rounded-lg border-Grape">
            {/* ORDER SUMMARY HEADER */}
            <div className="flex w-full p-2 justify-end border-b-4 border-black">
                {/*PRICE*/}
                <span className="text-xl my-3" data-testid={"#CartSubTotal"}>
                    <b className="mr-3">
                        Order Total:
                    </b> {numeral(cart.totalPrice).format("$0.00")}
                </span>
            </div>
            
            { cart.items.map(({ item }: ICartItem, index: number) => (
                <div 
                    className="flex h-60 w-full my-4 p-5 items-center justify-center border-b-2 border-Grape"
                    key={index}
                >
                    { item && (
                        <>

                            {/* LEFT */}
                            <div className="relative flex flex-col h-full w-56 justify-end">
                                <Image
                                    src={item.img ? item.img : images.Logo}
                                    className="ml-1"
                                    layout="fill"
                                    alt="Item"
                                />
                            </div>   

                            {/* RIGHT */}
                            <div className="flex flex-col w-72 h-60">

                                {/* INFO CONTAINER */}
                                <div className="flex h-full w-full mb-6 justify-end items-end">

                                    {/* INFO */}
                                    <div>
                                        {/* QUANTITY */}
                                        <p className="flex w-full">
                                            <b className="mr-3">
                                                Qty:
                                            </b> 
                                            <span className="flex justify-end">
                                                {item.quantity}
                                            </span>
                                        </p>

                                        {/* PRICE */}
                                        <span
                                            className="flex w-full"
                                        >
                                            <b className="mr-3">
                                                price:
                                            </b>
                                            {numeral(item.price).format("$0.00")}
                                        </span>

                                    </div>
                                </div>
                            </div>
                        </>
                    )    }
                </div>
            ) ) }
        </div>
    );
}