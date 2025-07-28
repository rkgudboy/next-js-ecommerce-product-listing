import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ProductsProvider, useProducts } from '../ProductsContext';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';

// Mock the product service
jest.mock('@/services/productService');
const mockedProductService = productService as jest.Mocked<typeof productService>;

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product 1',
    price: 10.00,
    description: 'Description 1',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/test1.jpg',
    rating: { rate: 4.5, count: 100 }
  },
  {
    id: 2,
    title: 'Product 2',
    price: 20.00,
    description: 'Description 2',
    category: 'clothing',
    image: 'https://fakestoreapi.com/img/test2.jpg',
    rating: { rate: 4.0, count: 50 }
  },
  {
    id: 3,
    title: 'Product 3',
    price: 30.00,
    description: 'Description 3',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/test3.jpg',
    rating: { rate: 3.5, count: 75 }
  }
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProductsProvider>{children}</ProductsProvider>
);

describe('ProductsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console.log and console.error mocks
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('initializes with correct default state', () => {
      const { result } = renderHook(() => useProducts(), { wrapper });
      
      expect(result.current.state).toEqual({
        products: [],
        categories: [],
        selectedCategory: null,
        loading: true,
        error: null
      });
      expect(result.current.filteredProducts).toEqual([]);
    });

    it('throws error when used outside ProductsProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => {
        renderHook(() => useProducts());
      }).toThrow('useProducts must be used within a ProductsProvider');
      
      consoleError.mockRestore();
    });
  });

  describe('Product Fetching', () => {
    it('fetches products successfully on mount', async () => {
      mockedProductService.getProducts.mockResolvedValueOnce(mockProducts);
      
      const { result } = renderHook(() => useProducts(), { wrapper });
      
      // Initially loading
      expect(result.current.state.loading).toBe(true);
      expect(result.current.state.products).toEqual([]);
      
      // Wait for products to be fetched
      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
      });
      
      expect(result.current.state.products).toEqual(mockProducts);
      expect(result.current.state.error).toBeNull();
      expect(mockedProductService.getProducts).toHaveBeenCalledTimes(1);
    });

    it('handles fetch error correctly', async () => {
      const errorMessage = 'Network error';
      mockedProductService.getProducts.mockRejectedValueOnce(new Error(errorMessage));
      
      const { result } = renderHook(() => useProducts(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
      });
      
      expect(result.current.state.products).toEqual([]);
      expect(result.current.state.error).toBe('Failed to load products. Please try again later.');
      expect(console.error).toHaveBeenCalledWith('Error fetching products:', expect.any(Error));
    });

    it('extracts categories correctly from products', async () => {
      mockedProductService.getProducts.mockResolvedValueOnce(mockProducts);
      
      const { result } = renderHook(() => useProducts(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
      });
      
      const expectedCategories = ['clothing', 'electronics']; // Categories are sorted alphabetically
      expect(result.current.state.categories).toEqual(expectedCategories);
    });

    it('handles empty products array', async () => {
      mockedProductService.getProducts.mockResolvedValueOnce([]);
      
      const { result } = renderHook(() => useProducts(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
      });
      
      expect(result.current.state.products).toEqual([]);
      expect(result.current.state.categories).toEqual([]);
      expect(result.current.filteredProducts).toEqual([]);
    });
  });

  describe('Category Filtering', () => {
    beforeEach(async () => {
      mockedProductService.getProducts.mockResolvedValue(mockProducts);
    });

    it('shows all products when no category is selected', async () => {
      const { result } = renderHook(() => useProducts(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
      });
      
      expect(result.current.filteredProducts).toEqual(mockProducts);
    });

    it('filters products by selected category', async () => {
      const { result } = renderHook(() => useProducts(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
      });
      
      act(() => {
        result.current.setSelectedCategory('electronics');
      });
      
      const electronicsProducts = mockProducts.filter(p => p.category === 'electronics');
      expect(result.current.state.selectedCategory).toBe('electronics');
      expect(result.current.filteredProducts).toEqual(electronicsProducts);
    });

    it('returns empty array for non-existent category', async () => {
      const { result } = renderHook(() => useProducts(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
      });
      
      act(() => {
        result.current.setSelectedCategory('non-existent');
      });
      
      expect(result.current.filteredProducts).toEqual([]);
    });

    it('resets to all products when category is cleared', async () => {
      const { result } = renderHook(() => useProducts(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
      });
      
      // First set a category
      act(() => {
        result.current.setSelectedCategory('electronics');
      });
      
      expect(result.current.filteredProducts.length).toBe(2);
      
      // Then clear it
      act(() => {
        result.current.setSelectedCategory(null);
      });
      
      expect(result.current.filteredProducts).toEqual(mockProducts);
    });
  });

  describe('State Transitions', () => {
    it('transitions from loading to success state correctly', async () => {
      mockedProductService.getProducts.mockResolvedValueOnce(mockProducts);
      
      const { result } = renderHook(() => useProducts(), { wrapper });
      
      // Initially loading
      expect(result.current.state.loading).toBe(true);
      expect(result.current.state.error).toBeNull();
      expect(result.current.state.products).toEqual([]);
      
      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
      });
      
      // After successful fetch
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBeNull();
      expect(result.current.state.products).toEqual(mockProducts);
    });

    it('transitions from loading to error state correctly', async () => {
      mockedProductService.getProducts.mockRejectedValueOnce(new Error('API Error'));
      
      const { result } = renderHook(() => useProducts(), { wrapper });
      
      // Initially loading
      expect(result.current.state.loading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
      });
      
      // After error
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBe('Failed to load products. Please try again later.');
      expect(result.current.state.products).toEqual([]);
    });
  });
});