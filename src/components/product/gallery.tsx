'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GridTileImage } from '@/components/grid/tile';
import clsx from 'clsx';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {currentImage?.src && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={currentImage.altText || ''}
            src={currentImage.src}
            priority={true}
          />
        )}
      </div>

      {images.length > 1 && (
        <ul className="flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === currentIndex;
            return (
              <li key={index} className="h-20 w-20">
                <button
                  aria-label={`Go to image ${index + 1}`}
                  className="h-full w-full"
                  onClick={() => setCurrentIndex(index)}
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}