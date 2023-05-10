import { useState, createContext, useEffect } from "react";
import { defaultCartContext, defaultCart } from "@/models";
import { type ICartContext, type IGalleryItem, type ICart, type ICartItem } from "@/types";
import { api } from "@/utils/api"

/**
 * This Context is used to collect shipping information from user
 *     and call server function to 
 * 
 * TOTAL PRICE
 * CHECKOUT BUTTON
 */
export const CartContext = createContext<ICartContext>({} as ICartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {

    const utils = api.useContext(); //reset payment intent if any modifications are made to cart

    const [cart, setCart] = useState<ICart>(defaultCart);
    const [quantity, setQuantity] = useState<ICartContext['quantity']>(1);
    const [openMenu, setOpenMenu] = useState<ICartContext["openMenu"]>(defaultCartContext.openMenu);

    //TODO: MODIFY THIS TO ACCEPT QUANTIY
    async function addToCart(quantity: number, item: IGalleryItem|null): Promise<void> {        
        if (!item || !item.id || quantity <= 0) return;
        const filtered:ICartItem[] = cart.items?.filter((el: ICartItem) => el.item?.id === item.id);
        const cartItem = filtered[0];

        {/* ITEM IS NOT IN CART */}
        if (!cartItem) {

            {/* INCREMENT CART ITEM QUANTITY */ }
            const updatedCart = { 
                items: [...cart.items, { item, quantity }],
                paymentIntent: null,
                totalPrice: cart.totalPrice + item.price
            }
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setCart(updatedCart);
            await utils.order.StripePaymentIntent.reset();
            return;
        }

        {/* ITEM ALREADY EXISTS IN CART */}
        if (!!cartItem) {
            const currentQuantity = cartItem.quantity;
            const updatedQuantity = currentQuantity + quantity;

            {/* ONLY ADD IF LESS THAN TOTAL AVAILABLE */}
            if (updatedQuantity <= item.quantity) {
               
                {/* INCREMENT CART ITEM QUANTITY */}
                const updatedCart = {
                    items: [...cart.items, { item, quantity }],
                    paymentIntent: null,
                    totalPrice: cart.totalPrice + item.price
                }
                setCart(updatedCart);

                localStorage.setItem("cart", JSON.stringify(updatedCart));
                await utils.order.StripePaymentIntent.reset();
            }       
        }
    }

    async function removeFromCart(item: IGalleryItem, cart: ICart): Promise<void> {
        if (!item || !item.id || !cart?.items) return;
        const filtered: ICartItem[] = cart.items.filter((el: ICartItem) => el.item?.id !== item.id);
        {/* DECREMENT CART ITEM QUANTITY */ }
        const updatedCart = {
            items: filtered,
            paymentIntent: null,
            totalPrice: cart.totalPrice - item.price
        }
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        await utils.order.StripePaymentIntent.reset();
    }

    async function emptyCart():Promise<void> {
        setCart(defaultCart);
        localStorage.setItem("cart", JSON.stringify(defaultCart));
        await utils.order.StripePaymentIntent.reset();
    }

    /**
     * **PRESERVES APP CART STATE**
     * 1. POPULATE CART WITH INFO FROM LOCALSTORAGE ON PAGE REFRESH
     * 2. PRESERVES VALUE OF ALL ITEMS IN CART 
     */
    useEffect(() => {
        const cartItems = localStorage.getItem("cart");
        if (!cartItems) return;

        // eslint-disable-next-line
        const cartData:ICart = JSON.parse(cartItems);
        if(!!cartData) {
            setCart(cartData);
        }
    }, []);

    return (
        <CartContext.Provider
            value={{
                openMenu,
                setOpenMenu,
                
                cart,
                setCart,
                quantity,
                setQuantity,
                addToCart,
                removeFromCart,
                emptyCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )

}