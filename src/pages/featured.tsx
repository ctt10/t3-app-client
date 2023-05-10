import React from "react";
import { Gallery } from "@/components";
import { useRouter } from 'next/router'

const FeaturedPage = () => {
  
  const router = useRouter()
  const { theme } = router.query

  return (
    <div className="flex h-full w-full min-h-screen items-center justify-around">
        {  !!theme && (
            <Gallery itemType={undefined} theme={theme} />
        )  }
    </div>
  );
}

export default FeaturedPage;