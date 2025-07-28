import axios from 'axios';
import { productService } from '../productService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('productService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful API Calls', () => {
    it('fetches products successfully', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Product 1',
          price: 10.00,
          description: 'Description 1',
          category: 'test',
          image: 'https://fakestoreapi.com/img/test1.jpg',
          rating: { rate: 4.5, count: 100 }
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });

      const result = await productService.getProducts();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('equalexperts.github.io')
      );
      expect(result).toEqual(mockProducts);
    });

    it('handles empty product array response', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const result = await productService.getProducts();

      expect(result).toEqual([]);
    });

    it('handles large product array response', async () => {
      const largeProductArray = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Product ${i + 1}`,
        price: 10.00,
        description: `Description ${i + 1}`,
        category: 'test',
        image: 'https://fakestoreapi.com/img/test.jpg',
        rating: { rate: 4.5, count: 100 }
      }));

      mockedAxios.get.mockResolvedValueOnce({ data: largeProductArray });

      const result = await productService.getProducts();

      expect(result).toHaveLength(10);
      expect(result[0].title).toBe('Product 1');
    });
  });

  describe('Error Scenarios', () => {
    it('throws error when API call fails', async () => {
      const mockError = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      await expect(productService.getProducts()).rejects.toThrow('Network error');
      
      expect(consoleError).toHaveBeenCalledWith('Error fetching products:', mockError);
      
      consoleError.mockRestore();
    });

    it('handles HTTP errors', async () => {
      const httpError = {
        response: {
          status: 404,
          statusText: 'Not Found'
        }
      };
      mockedAxios.get.mockRejectedValueOnce(httpError);

      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      await expect(productService.getProducts()).rejects.toEqual(httpError);
      
      expect(consoleError).toHaveBeenCalledWith('Error fetching products:', httpError);
      
      consoleError.mockRestore();
    });

    it('handles timeout errors', async () => {
      const timeoutError = new Error('timeout exceeded');
      mockedAxios.get.mockRejectedValueOnce(timeoutError);

      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      await expect(productService.getProducts()).rejects.toThrow('timeout exceeded');
      
      expect(consoleError).toHaveBeenCalledWith('Error fetching products:', timeoutError);
      
      consoleError.mockRestore();
    });
  });

  describe('Response Validation', () => {
    it('handles different response types', async () => {
      const responseData = { products: [] };
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await productService.getProducts();

      expect(result).toEqual(responseData);
    });

    it('handles null response', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: null });

      const result = await productService.getProducts();

      expect(result).toBeNull();
    });

    it('handles undefined response', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: undefined });

      const result = await productService.getProducts();

      expect(result).toBeUndefined();
    });
  });
});