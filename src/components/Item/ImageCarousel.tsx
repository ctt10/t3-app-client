import React, { useState, useEffect } from "react";
import Image from "next/image";
import images from "@/Assets"

type CarouselProps = {
  itemImages: string[];
};

type DotProps = {
  active: boolean;
  onClick: () => void;
};

const Dot: React.FC<DotProps> = ({ active, onClick }) => {
  return (
    <button
      className={`w-3 h-3 rounded-full mx-1 focus:outline-none ${
        active ? "bg-gray-500" : "bg-gray-300"
      }`}
      onClick={onClick}
    />
  );
};

const Carousel: React.FC<CarouselProps> = ({ itemImages }) => {
  const [currentImage, setCurrentImage] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage((currentImage + 1) % itemImages?.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentImage]);

  const handlePrev = () => {
    setCurrentImage((currentImage - 1 + itemImages.length) % itemImages.length);
  };

  const handleNext = () => {
    setCurrentImage((currentImage + 1) % itemImages.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div className="relative h-GalleryItem w-GalleryItem bg-gray-200">
      {itemImages?.map((image, index) => (
        <Image
          key={index}
          src={images.Logo}
          height={30}
          width={30}
          alt="item image"
          className={`absolute w-full h-full transition-opacity ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <button
        className="absolute top-1/2 left-3 transform -translate-y-1/2 focus:outline-none"
        onClick={handlePrev}
      >
        <Image
          src={images.ChevronLeft}
          height={30}
          width={30}
          className="h-8 w-8 text-gray-500"
          alt="left"
        />

      </button>
      <button
        className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none"
        onClick={handleNext}
      >
        <Image
          src={images.ChevronRight}
          height={30}
          width={30}
          className="h-8 w-8 text-gray-500"
          alt="left"
        />
      </button>
      <div className="absolute bottom-5 w-full flex justify-center">
        {itemImages?.map((_, index) => (
          <Dot
            key={index}
            active={index === currentImage}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;