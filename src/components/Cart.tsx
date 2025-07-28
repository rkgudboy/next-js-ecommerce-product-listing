'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

export const Cart: React.FC = () => {
  const { state, updateQuantity, removeFromCart } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      <div className="space-y-4">
        {state.items.map((item) => (
          <div key={item.product.id} className="flex items-center space-x-4 pb-4 border-b">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={item.product.image}
                alt={item.product.title}
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-sm line-clamp-2">{item.product.title}</h3>
              <p className="text-gray-900 font-semibold">£{item.product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                className="w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <p className="font-semibold">£{(item.product.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-600 hover:text-red-700 text-sm"
                aria-label="Remove from cart"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-2xl font-bold text-red-600">£{state.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};