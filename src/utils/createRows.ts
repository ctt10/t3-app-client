import { type IGalleryItem } from "@/types";

export default function createRows(galleryItems: IGalleryItem[] | undefined): IGalleryItem[][] | null {
    if(galleryItems?.length === 0 ||galleryItems===undefined ) return null;
    
    const galleryRows: IGalleryItem[][] = [];
    
    const chunkSize = 3;
    for (let i = 0; i < galleryItems.length; i += chunkSize) {
        const chunk: IGalleryItem[] = galleryItems.slice(i, i + chunkSize);
        galleryRows.push(chunk);
    }

    return galleryRows;
}