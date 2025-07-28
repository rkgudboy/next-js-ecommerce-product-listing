'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '@/types/product';
import { productService } from '@/services/productService';

interface ProductsState {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
}

type ProductsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string | null };

interface ProductsContextType {
  state: ProductsState;
  filteredProducts: Product[];
  setSelectedCategory: (category: string | null) => void;
  refetch: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const productsReducer = (state: ProductsState, action: ProductsAction): ProductsState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    
    case 'FETCH_SUCCESS': {
      // Extract unique categories from products
      const categories = Array.from(
        new Set(action.payload.map(product => product.category))
      ).sort();
      
      return {
        ...state,
        products: action.payload,
        categories,
        loading: false,
        error: null
      };
    }
    
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    default:
      return state;
  }
};

const initialState: ProductsState = {
  products: [],
  categories: [],
  loading: true,
  error: null,
  selectedCategory: null
};

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);

  const fetchProducts = async () => {
    console.log('Starting to fetch products...');
    dispatch({ type: 'FETCH_START' });
    try {
      const products = await productService.getProducts();
      console.log('Products fetched successfully:', products.length);
      dispatch({ type: 'FETCH_SUCCESS', payload: products });
    } catch (error) {
      console.error('Error fetching products:', error);
      dispatch({ type: 'FETCH_ERROR', payload: 'Failed to load products. Please try again later.' });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const setSelectedCategory = (category: string | null) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const filteredProducts = state.selectedCategory
    ? state.products.filter(product => product.category === state.selectedCategory)
    : state.products;

  const refetch = async () => {
    await fetchProducts();
  };

  return (
    <ProductsContext.Provider 
      value={{ 
        state, 
        filteredProducts, 
        setSelectedCategory, 
        refetch 
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};