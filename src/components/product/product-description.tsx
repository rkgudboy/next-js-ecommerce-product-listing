'use client';

import { Product } from '@/types/product';
import Price from '@/components/price';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon, CheckIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';

export function ProductDescription({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addToCart(product);
    
    // Show success toast
    toast.success(`${product.title} added to cart!`);
    
    // Reset button state after animation
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-4xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.price.toFixed(2)}
            currencyCode="GBP"
            currencyCodeClassName="hidden @[275px]:inline"
          />
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => {
            const isFilled = i < Math.floor(product.rating.rate);
            return isFilled ? (
              <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" data-testid="star-filled" />
            ) : (
              <StarIcon key={i} className="h-4 w-4 text-neutral-200 dark:text-neutral-800" data-testid="star-empty" />
            );
          })}
          <span className="ml-2 text-neutral-600 dark:text-neutral-400">
            {product.rating.rate} ({product.rating.count} reviews)
          </span>
        </div>
      </div>

      <div className="prose prose-sm mb-6 text-neutral-600 dark:prose-invert dark:text-neutral-400">
        <p>{product.description}</p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Category: <span className="font-medium">{product.category}</span>
        </p>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        aria-label={`Add ${product.title} to cart`}
        className={clsx(
          "relative flex w-full items-center justify-center gap-3 rounded-full p-4 tracking-wide text-white font-medium transition-all duration-300",
          isAdding 
            ? "bg-green-600 scale-105 shadow-lg" 
            : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-95"
        )}
      >
        {isAdding ? (
          <CheckIcon className="h-5 w-5 transition-all duration-300" />
        ) : (
          <PlusIcon className="h-5 w-5 transition-all duration-300" />
        )}
        <span className="transition-all duration-300">
          {isAdding ? "Added!" : "Add to Cart"}
        </span>
      </button>
    </>
  );
}