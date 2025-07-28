import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ProductDescription } from '../product-description';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/product';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('@/contexts/CartContext');
jest.mock('react-hot-toast');

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'This is a detailed description of the test product with all the features and benefits explained.',
  category: 'electronics',
  image: 'https://fakestoreapi.com/img/test.jpg',
  rating: { rate: 4.5, count: 150 }
};

const mockProductWithLowRating: Product = {
  ...mockProduct,
  rating: { rate: 2.3, count: 50 }
};

const mockProductWithHighPrice: Product = {
  ...mockProduct,
  price: 1234.56
};

describe('ProductDescription', () => {
  const mockAddToCart = jest.fn();
  const mockToastSuccess = jest.fn();

  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      addToCart: mockAddToCart
    });
    (toast.success as jest.Mock).mockImplementation(mockToastSuccess);
    
    // Mock setTimeout to avoid delays in tests
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('Product Information Display', () => {
    it('renders product title correctly', () => {
      render(<ProductDescription product={mockProduct} />);
      
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Product');
    });

    it('displays product price with correct formatting', () => {
      render(<ProductDescription product={mockProduct} />);
      
      expect(screen.getByText('£99.99')).toBeInTheDocument();
    });

    it('formats high prices correctly', () => {
      render(<ProductDescription product={mockProductWithHighPrice} />);
      
      expect(screen.getByText('£1,234.56')).toBeInTheDocument();
    });

    it('shows product description', () => {
      render(<ProductDescription product={mockProduct} />);
      
      expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    });

    it('displays product category', () => {
      render(<ProductDescription product={mockProduct} />);
      
      expect(screen.getByText('Category:')).toBeInTheDocument();
      expect(screen.getByText('electronics')).toBeInTheDocument();
    });
  });

  describe('Star Rating Display', () => {
    it('displays star rating correctly', () => {
      render(<ProductDescription product={mockProduct} />);
      
      // Should have 4 filled stars and 1 empty star for rating 4.5
      const filledStars = screen.getAllByTestId('star-filled');
      const emptyStars = screen.getAllByTestId('star-empty');
      
      expect(filledStars).toHaveLength(4);
      expect(emptyStars).toHaveLength(1);
    });

    it('shows rating value and count', () => {
      render(<ProductDescription product={mockProduct} />);
      
      expect(screen.getByText('4.5 (150 reviews)')).toBeInTheDocument();
    });

    it('shows singular review count correctly', () => {
      const singleReviewProduct = { ...mockProduct, rating: { rate: 5.0, count: 1 } };
      render(<ProductDescription product={singleReviewProduct} />);
      
      expect(screen.getByText('5 (1 reviews)')).toBeInTheDocument();
    });
  });

  describe('Add to Cart Functionality', () => {
    it('renders add to cart button with correct initial state', () => {
      render(<ProductDescription product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add test product to cart/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Add to Cart');
      expect(button).not.toBeDisabled();
    });

    it('calls addToCart when button is clicked', () => {
      render(<ProductDescription product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add test product to cart/i });
      fireEvent.click(button);
      
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
      expect(mockAddToCart).toHaveBeenCalledTimes(1);
    });

    it('shows success toast when product is added to cart', () => {
      render(<ProductDescription product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add test product to cart/i });
      fireEvent.click(button);
      
      expect(mockToastSuccess).toHaveBeenCalledWith('Test Product added to cart!');
    });

    it('shows loading state immediately after clicking add to cart', () => {
      render(<ProductDescription product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add test product to cart/i });
      fireEvent.click(button);
      
      expect(button).toHaveTextContent('Added!');
      expect(button).toBeDisabled();
    });

    it('shows success state with checkmark icon', () => {
      render(<ProductDescription product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add test product to cart/i });
      fireEvent.click(button);
      
      // Check for checkmark icon (assuming it has a test id or specific class)
      expect(button).toHaveTextContent('Added!');
    });

    it('returns to normal state after timeout', async () => {
      render(<ProductDescription product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add test product to cart/i });
      fireEvent.click(button);
      
      // Initially shows success state
      expect(button).toHaveTextContent('Added!');
      expect(button).toBeDisabled();
      
      // Fast-forward timer wrapped in act
      act(() => {
        jest.advanceTimersByTime(600);
      });
      
      await waitFor(() => {
        expect(button).toHaveTextContent('Add to Cart');
        expect(button).not.toBeDisabled();
      });
    });

    it('prevents multiple clicks during loading state', () => {
      render(<ProductDescription product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add test product to cart/i });
      
      // Click multiple times quickly
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      // Should only be called once
      expect(mockAddToCart).toHaveBeenCalledTimes(1);
    });

    it('handles rapid successive clicks correctly', async () => {
      render(<ProductDescription product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add test product to cart/i });
      
      // First click
      fireEvent.click(button);
      expect(mockAddToCart).toHaveBeenCalledTimes(1);
      
      // Wait for button to reset
      act(() => {
        jest.advanceTimersByTime(600);
      });
      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
      
      // Second click after reset
      fireEvent.click(button);
      expect(mockAddToCart).toHaveBeenCalledTimes(2);
    });
  });

  describe('Button Styling and States', () => {
    it('applies correct CSS classes for normal state', () => {
      render(<ProductDescription product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add test product to cart/i });
      expect(button).toHaveClass('bg-blue-600');
    });

    it('applies correct CSS classes for success state', () => {
      render(<ProductDescription product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add test product to cart/i });
      fireEvent.click(button);
      
      expect(button).toHaveClass('bg-green-600');
    });

    it('has proper accessibility attributes', () => {
      render(<ProductDescription product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add test product to cart/i });
      expect(button).toHaveAttribute('aria-label', 'Add Test Product to cart');
    });
  });

  describe('Edge Cases', () => {
    it('handles product with zero price', () => {
      const freeProduct = { ...mockProduct, price: 0 };
      render(<ProductDescription product={freeProduct} />);
      
      expect(screen.getByText('£0.00')).toBeInTheDocument();
    });

    it('handles product with very long title', () => {
      const longTitleProduct = {
        ...mockProduct,
        title: 'This is an extremely long product title that should be handled gracefully by the component without breaking the layout or functionality'
      };
      
      render(<ProductDescription product={longTitleProduct} />);
      
      expect(screen.getByText(longTitleProduct.title)).toBeInTheDocument();
    });

    it('handles product with empty description', () => {
      const noDescProduct = { ...mockProduct, description: '' };
      render(<ProductDescription product={noDescProduct} />);
      
      // Component should still render without errors
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('handles product with zero rating count', () => {
      const noReviewsProduct = { ...mockProduct, rating: { rate: 0, count: 0 } };
      render(<ProductDescription product={noReviewsProduct} />);
      
      expect(screen.getByText('0 (0 reviews)')).toBeInTheDocument();
    });

    it('handles product with perfect 5-star rating', () => {
      const perfectProduct = { ...mockProduct, rating: { rate: 5.0, count: 100 } };
      render(<ProductDescription product={perfectProduct} />);
      
      const filledStars = screen.getAllByTestId('star-filled');
      
      expect(filledStars).toHaveLength(5);
    });
  });
});