/**
 * Type definitions for the e-commerce application
 * Central place for all TypeScript interfaces and types
 */

// ============ Product Types ============

/**
 * Represents a customer review for a product
 */
export interface Review {
  rating: number;        // 1-5 star rating
  comment: string;        // Review text content
  date: string;           // ISO date string
  reviewerName: string;  // Name of the reviewer
  reviewerEmail: string; // Email of the reviewer
}

/**
 * Core product data structure
 * Represents a product in the catalog
 */
export interface Product {
  id: number;             // Unique product identifier
  title: string;          // Product name/title
  description: string;   // Detailed product description
  price: number;          // Price in the default currency
  discountPercentage: number; // Discount applied (0-100)
  rating: number;         // Average customer rating (0-5)
  stock: number;          // Available inventory quantity
  brand: string;          // Product brand/manufacturer
  category: string;      // Product category slug
  thumbnail: string;     // URL to product thumbnail image
  images: string[];      // Array of product image URLs
  reviews?: Review[];     // Optional array of product reviews
}

// ============ Category Types ============

/**
 * Represents a product category for filtering
 */
export interface Category {
  slug: string;  // URL-friendly category identifier
  name: string; // Display name for the category
  url: string;  // API endpoint for the category
}

/**
 * Response wrapper for product list API calls
 */
export interface ProductsResponse {
  products: Product[];  // Array of products
  total: number;        // Total number of products available
  skip: number;        // Number of products skipped (pagination)
  limit: number;       // Maximum products returned
}

// ============ Cart Types ============

/**
 * An item in the shopping cart with quantity
 */
export interface CartItem {
  product: Product;     // The product being purchased
  quantity: number;     // Number of units
}

// ============ Authentication Types ============

/**
 * Credentials for user login
 */
export interface LoginCredentials {
  username: string;  // User's username or email
  password: string; // User's password
}

/**
 * Response from authentication API
 * Contains user data and authentication token
 */
export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;       // JWT access token
  phone?: string;      // Optional phone number
}

/**
 * Internal user representation (used in app state)
 */
export interface AuthUser {
  id: number | string;  // Support both number (DummyJSON) and string (Firebase)
  username?: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  phone?: string;
}