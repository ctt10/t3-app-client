import { useContext, useEffect } from "react";
import { ItemContext } from "@/context/ItemContext";
import { GalleryItem } from "@/components"

/** @types */
import { type Item } from "@prisma/client";

interface CustomPageProps {
   itemType: string|string[]|undefined
   theme: string|string[]|undefined
}

//TODO: QUERY PAGINATION

export default function Gallery(props: CustomPageProps) {
    const { itemType, theme } = props;

    const { setTheme, setItemType, fetchedItems } = useContext(ItemContext);
    
    useEffect(()=> {
        if (!!itemType && typeof itemType === 'string') {
            setTheme(undefined);
            setItemType(itemType);
        }

        if (!!theme && typeof theme === 'string') {
            setItemType(undefined);
            setTheme(theme);
        }
    }, [itemType, theme, setItemType, setTheme])

    return (
        <div className="flex flex-col h-full w-full mx-20 items-center justify-center"> 
            <div className="flex flex-wrap w-full justify-start py-16 max-w-[1800px]">
            {/* Item List */}
            { fetchedItems && fetchedItems?.map(
                (item: Item, i: number) => (
                    <div 
                        className="flex overflow-wrap my-5 rounded-2xl group perspective preserve-3d"
                        key={i}
                    >
                        <GalleryItem 
                            item={item}
                            key={i}
                        />
                    </div>
            ))    }
            </div>
        </div>
    );
}

