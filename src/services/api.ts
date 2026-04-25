import type { Product, ProductsResponse, AuthResponse, LoginCredentials, Category } from '../types';

const BASE_URL = 'https://dummyjson.com';

class ApiService {
  private async fetchData<T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<T> {
    const headers = new Headers(options.headers);

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

  // Products
  async getProducts(limit: number = 20, skip: number = 0): Promise<ProductsResponse> {
    return this.fetchData<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
  }

  async getProductById(id: number): Promise<Product> {
    return this.fetchData<Product>(`/products/${id}`);
  }

  async searchProducts(query: string, limit: number = 20): Promise<ProductsResponse> {
    return this.fetchData<ProductsResponse>(`/products/search?q=${query}&limit=${limit}`);
  }

  async getProductsByCategory(category: string, limit: number = 20): Promise<ProductsResponse> {
    return this.fetchData<ProductsResponse>(`/products/category/${category}?limit=${limit}`);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.fetchData<Category[]>('/products/categories');
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.fetchData<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(token: string): Promise<AuthResponse> {
    return this.fetchData<AuthResponse>('/auth/me', {}, token);
  }
}

export const apiService = new ApiService();
export default apiService;