import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Cart } from '../Cart';
import { useCart } from '@/contexts/CartContext';
import { CartState } from '@/types/product';

jest.mock('@/contexts/CartContext');

const mockCartState: CartState = {
  items: [
    {
      product: {
        id: 1,
        title: 'Product 1',
        price: 10.00,
        description: 'Description 1',
        category: 'test',
        image: 'https://fakestoreapi.com/img/test1.jpg',
        rating: { rate: 4.5, count: 100 }
      },
      quantity: 2
    },
    {
      product: {
        id: 2,
        title: 'Product 2',
        price: 20.00,
        description: 'Description 2',
        category: 'test',
        image: 'https://fakestoreapi.com/img/test2.jpg',
        rating: { rate: 4.0, count: 50 }
      },
      quantity: 1
    }
  ],
  total: 40.00
};

describe('Cart', () => {
  const mockUpdateQuantity = jest.fn();
  const mockRemoveFromCart = jest.fn();

  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      state: mockCartState,
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty cart message when no items', () => {
    (useCart as jest.Mock).mockReturnValue({
      state: { items: [], total: 0 },
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart
    });

    render(<Cart />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders all cart items', () => {
    render(<Cart />);
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('displays correct quantities', () => {
    render(<Cart />);
    
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays correct item prices', () => {
    render(<Cart />);
    
    // Check that product prices are displayed
    expect(screen.getByText('£10.00')).toBeInTheDocument();
    // There will be multiple £20.00 texts (price and subtotal)
    const twentyPoundTexts = screen.getAllByText('£20.00');
    expect(twentyPoundTexts.length).toBeGreaterThan(0);
  });

  it('displays correct subtotals', () => {
    render(<Cart />);
    
    // Product 2 has both price and subtotal of £20.00, plus Product 1's subtotal
    const twentyPoundTexts = screen.getAllByText('£20.00');
    expect(twentyPoundTexts.length).toBeGreaterThanOrEqual(2);
  });

  it('displays correct total', () => {
    render(<Cart />);
    
    expect(screen.getByText('£40.00')).toBeInTheDocument();
  });

  it('calls updateQuantity when increase button is clicked', () => {
    render(<Cart />);
    
    const increaseButtons = screen.getAllByLabelText('Increase quantity');
    fireEvent.click(increaseButtons[0]);
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('calls updateQuantity when decrease button is clicked', () => {
    render(<Cart />);
    
    const decreaseButtons = screen.getAllByLabelText('Decrease quantity');
    fireEvent.click(decreaseButtons[0]);
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 1);
  });

  it('calls removeFromCart when remove button is clicked', () => {
    render(<Cart />);
    
    const removeButtons = screen.getAllByLabelText('Remove from cart');
    fireEvent.click(removeButtons[0]);
    
    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
  });
});