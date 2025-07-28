'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types/product';

export function EditItemQuantityButton({
  item,
  type
}: {
  item: CartItem;
  type: 'plus' | 'minus';
}) {
  const { updateQuantity } = useCart();

  return (
    <button
      aria-label={
        type === 'minus' ? 'Decrease item quantity' : 'Increase item quantity'
      }
      onClick={() => {
        const newQuantity = type === 'minus' 
          ? Math.max(0, item.quantity - 1)
          : item.quantity + 1;
        updateQuantity(item.product.id, newQuantity);
      }}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'ml-auto': type === 'minus'
        }
      )}
    >
      {type === 'plus' ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}