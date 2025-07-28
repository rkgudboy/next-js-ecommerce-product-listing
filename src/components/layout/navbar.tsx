'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import CartModal from '@/components/cart/modal';
import { ShoppingBagIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { state } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const isHomePage = pathname === '/';

  return (
    <>
      <nav className="relative flex items-center justify-between p-4 lg:px-6">
        <div className="block flex-none md:hidden">
          {/* Mobile menu button would go here */}
        </div>
        <div className="flex w-full items-center">
          <div className="flex w-full md:w-1/3">
            <Link
              href="/"
              prefetch={true}
              className={`mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6 ${
                isHomePage 
                  ? 'cursor-default opacity-50' 
                  : 'hover:opacity-75 transition-opacity'
              }`}
              onClick={isHomePage ? (e) => e.preventDefault() : undefined}
            >
              <HomeIcon 
                className={`h-5 w-5 mr-2 ${
                  isHomePage 
                    ? 'text-neutral-400 dark:text-neutral-600' 
                    : 'text-neutral-900 dark:text-neutral-100'
                }`} 
              />
              <div className="ml-2 flex-none text-sm font-medium uppercase hidden md:block lg:block">
                {process.env.NEXT_PUBLIC_STORE_NAME || ""} Store
              </div>
            </Link>
          </div>
          <div className="hidden justify-center md:flex md:w-1/3">
            {/* Search would go here */}
          </div>
          <div className="flex justify-end md:w-1/3">
            <div className="flex items-center">
              <button
                aria-label={`Open cart with ${itemCount} items`}
                onClick={() => setIsCartOpen(true)}
                className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:scale-110 dark:border-neutral-700 dark:text-white"
              >
                <ShoppingBagIcon className="h-4 w-4" />
                {itemCount > 0 && (
                  <div className="absolute -right-2 -top-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white flex items-center justify-center">
                    {itemCount}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}