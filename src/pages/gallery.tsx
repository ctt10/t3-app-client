import React from "react";
import { Gallery } from "@/components";
import { useRouter } from 'next/router'

const GalleryPage = () => {
  
  const router = useRouter()
  const { itemType } = router.query

  return (
    <div className="flex h-full w-full min-h-screen items-center justify-around">
        {  !!itemType && (
          <Gallery itemType={itemType} theme={undefined} />
        )  }
    </div>
  );
}

export default GalleryPage;