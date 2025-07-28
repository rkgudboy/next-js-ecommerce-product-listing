import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import { Product } from '@/types/product';

const mockProduct1: Product = {
  id: 1,
  title: 'Product 1',
  price: 10.00,
  description: 'Description 1',
  category: 'test',
  image: 'https://fakestoreapi.com/img/test1.jpg',
  rating: { rate: 4.5, count: 100 }
};

const mockProduct2: Product = {
  id: 2,
  title: 'Product 2',
  price: 20.00,
  description: 'Description 2',
  category: 'test',
  image: 'https://fakestoreapi.com/img/test2.jpg',
  rating: { rate: 4.0, count: 50 }
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.state.total).toBe(0);
  });

  it('adds product to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct1);
    });
    
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].product.id).toBe(1);
    expect(result.current.state.items[0].quantity).toBe(1);
    expect(result.current.state.total).toBe(10.00);
  });

  it('increments quantity when adding existing product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct1);
      result.current.addToCart(mockProduct1);
    });
    
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].quantity).toBe(2);
    expect(result.current.state.total).toBe(20.00);
  });

  it('adds multiple different products', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct1);
      result.current.addToCart(mockProduct2);
    });
    
    expect(result.current.state.items).toHaveLength(2);
    expect(result.current.state.total).toBe(30.00);
  });

  it('removes product from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct1);
      result.current.addToCart(mockProduct2);
      result.current.removeFromCart(1);
    });
    
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].product.id).toBe(2);
    expect(result.current.state.total).toBe(20.00);
  });

  it('updates product quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct1);
      result.current.updateQuantity(1, 5);
    });
    
    expect(result.current.state.items[0].quantity).toBe(5);
    expect(result.current.state.total).toBe(50.00);
  });

  it('removes product when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct1);
      result.current.updateQuantity(1, 0);
    });
    
    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.state.total).toBe(0);
  });

  it('clears entire cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct1);
      result.current.addToCart(mockProduct2);
      result.current.clearCart();
    });
    
    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.state.total).toBe(0);
  });

  it('calculates total correctly with multiple items and quantities', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct1);
      result.current.addToCart(mockProduct1);
      result.current.addToCart(mockProduct2);
      result.current.updateQuantity(2, 3);
    });
    
    expect(result.current.state.total).toBe(80.00); // (2 × 10) + (3 × 20)
  });

  it('throws error when useCart is used outside CartProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');
    
    consoleError.mockRestore();
  });
});