import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/product';

jest.mock('@/contexts/CartContext');

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'Test Description',
  category: 'test',
  image: 'https://fakestoreapi.com/img/test.jpg',
  rating: { rate: 4.5, count: 100 }
};

describe('ProductCard', () => {
  const mockAddToCart = jest.fn();

  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      addToCart: mockAddToCart
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('£99.99')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('displays product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
  });

  it('calls addToCart when button is clicked', () => {
    render(<ProductCard product={mockProduct} />);
    
    const button = screen.getByRole('button', { name: /add test product to cart/i });
    fireEvent.click(button);
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });

  it('handles long product titles with ellipsis', () => {
    const longTitleProduct = {
      ...mockProduct,
      title: 'This is a very long product title that should be truncated with ellipsis when displayed in the card'
    };
    
    render(<ProductCard product={longTitleProduct} />);
    
    const title = screen.getByText(longTitleProduct.title);
    expect(title).toHaveClass('line-clamp-2');
  });

  it('formats price to 2 decimal places', () => {
    const priceProduct = { ...mockProduct, price: 10.5 };
    render(<ProductCard product={priceProduct} />);
    
    expect(screen.getByText('£10.50')).toBeInTheDocument();
  });
});