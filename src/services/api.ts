import type { Product, ProductsResponse, AuthResponse, LoginCredentials, Category } from '../types';

// Base URL for the DummyJSON API - acts as our backend for product data
const BASE_URL = 'https://dummyjson.com';

/**
 * ApiService - Handles all communication with the external API
 * Provides a clean interface for fetching products, categories, and user authentication
 */
class ApiService {
  /**
   * Generic fetch method that handles all API requests
   * Includes automatic token handling for authenticated requests
   */
  private async fetchData<T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<T> {
    const headers = new Headers(options.headers);

    // Attach authorization token if provided (for protected routes)
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, { 
      ...options, 
      headers 
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  // ============ Product Operations ============

  /**
   * Fetches a list of products with pagination support
   * @param limit - Maximum number of products to return
   * @param skip - Number of products to skip (for pagination)
   */
  async getProducts(limit: number = 20, skip: number = 0): Promise<ProductsResponse> {
    return this.fetchData<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
  }

  /**
   * Fetches a single product by its unique identifier
   */
  async getProductById(id: number): Promise<Product> {
    return this.fetchData<Product>(`/products/${id}`);
  }

  /**
   * Searches products based on a query string
   * Useful for implementing search functionality
   */
  async searchProducts(query: string, limit: number = 20): Promise<ProductsResponse> {
    return this.fetchData<ProductsResponse>(`/products/search?q=${query}&limit=${limit}`);
  }

  /**
   * Fetches all products belonging to a specific category
   */
  async getProductsByCategory(category: string, limit: number = 20): Promise<ProductsResponse> {
    return this.fetchData<ProductsResponse>(`/products/category/${category}?limit=${limit}`);
  }

  /**
   * Retrieves all available product categories
   */
  async getAllCategories(): Promise<Category[]> {
    return this.fetchData<Category[]>('/products/categories');
  }

  // ============ Authentication Operations ============

  /**
   * Authenticates a user with their credentials
   * Returns user data and access token on success
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.fetchData<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  }

  /**
   * Fetches the current authenticated user's information
   * Requires a valid authentication token
   */
  async getCurrentUser(token: string): Promise<AuthResponse> {
    return this.fetchData<AuthResponse>('/auth/me', {}, token);
  }
}

// Export a singleton instance for use throughout the application
export const apiService = new ApiService();
export default apiService;