'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types/product';

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { removeFromCart } = useCart();

  return (
    <button
      aria-label="Remove cart item"
      onClick={() => removeFromCart(item.product.id)}
      className={clsx(
        'ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200',
        'hover:bg-neutral-800 dark:bg-neutral-400 dark:hover:bg-neutral-100'
      )}
    >
      <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
    </button>
  );
}