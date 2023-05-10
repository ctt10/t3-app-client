import { useState, useEffect } from "react";
import Image, { type StaticImageData } from "next/image";
import images from "@/Assets";
import Link from "next/link";
import { galleryThemes } from "@/utils/constants/galleryThemes";

interface GalleryThemes {
  name: string
  image: StaticImageData | string
  color: string
  borderColor: string
  rotate: string
  xTranslate: string
}

export default function Wheel() {

  const [isSpinning, setIsSpinning] = useState<boolean>(true);

  useEffect(() => {
    setIsSpinning(false);
  },[]);


  const theme: GalleryThemes[] = [{
    name: galleryThemes[0] as string,
    image: "",
    color: "bg-Grape",
    borderColor: "border-blue-600",
    rotate: "",
    xTranslate: "translate-x-1/2 "
  }, {
    name: galleryThemes[1] as string,
    image: "",
    color: "bg-orange-600",
    borderColor: "border-green-500",
    rotate: "rotate-180",
    xTranslate: "translate-x-full "
  }]

  return (
    <div className="flex h-full justify-center items-center">
      <div 
        className={`relative z-30 min-w-[800px] w-[800px] h-[800px] rounded-full transition duration-300 transform ${
          isSpinning ? "rotate-full" : ""
        }`}>
        {theme.map((t, i) => (
            <Link 
              key={i} 
              href={{ pathname: '/featured', query: { theme: `${t.name}` } }}
            >
              <div
                data-testid="WHEEL_HALF"
                className={`absolute w-full h-full rounded-full border-8 ${t.borderColor} ${t.color} cursor-pointer`}
                style={{
                  transform: `rotate(${isSpinning ? 360 : i * 180}deg)`,
                  transition: 'transform 2s',
                  clipPath: 'polygon(100% 100%, 0% 100%, 0% 0%)',
                }}
              >
                <Image alt="Gallery Section" src={images.Logo} layout="fill" objectFit="cover" />
                <div className={`absolute bottom-28 ${t.xTranslate} text-white text-4xl font-bold font-CocoBiker ${t.rotate} ${isSpinning ? "hidden" : ""}`}>
                  {t.name}
                </div>
              </div>
            </Link>
        ))}
      </div>
    </div>
  );
}