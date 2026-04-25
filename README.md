# VueShop - E-Commerce SPA

A high-performance, responsive Single Page Application built with **Vue 3**, **TypeScript**, and **Tailwind CSS**. This project demonstrates modern frontend patterns, including state persistence, complex filtering, and secure authentication flows using the DummyJSON API.

## 🚀 Live Demo
Check out the live application: [https://umarharees2003-ghb.github.io/vue-shop-2026/](https://umarharees2003-ghb.github.io/vue-shop-2026/)

## Features

- **Product Listing**: Browse products from DummyJSON API
- **Search & Filter**: Search products by name and filter by category
- **Product Details**: View detailed product information in a modal
- **Shopping Cart**: Full cart lifecycle with quantity management and subtotal calculation (persisted via Pinia).
- **Authentication**: Secure login simulation with JWT-like token handling and session restoration.
- **Dark Mode**: Automatic theme detection and manual toggle with persistent settings.
- **Responsive Design**: Optimized for everything from mobile phones to high-resolution desktops.

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Vite
- Tailwind CSS
- Pinia (State Management)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/umarharees2003-ghb/vue-shop-2026.git
   cd vue-shop-2026
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deployment

This project is configured for easy deployment to GitHub Pages:

```bash
npm run deploy
```

## Project Structure

```
src/
├── components/       # Reusable Vue components
│   ├── NavBar.vue
│   ├── ProductCard.vue
│   ├── FilterBar.vue
│   ├── ProductModal.vue
│   ├── CartModal.vue
│   └── AuthModal.vue
├── services/          # API services
│   └── api.ts
├── stores/            # Pinia stores
│   ├── cart.ts
│   ├── auth.ts
│   └── theme.ts
├── types/             # TypeScript interfaces
│   └── index.ts
├── App.vue            # Main application component
├── main.ts            # Application entry point
└── style.css          # Global styles with Tailwind
```

## Demo Credentials

- Username: `kminchelle`
- Password: `0lelplR`

## API Reference

This project uses the [DummyJSON](https://dummyjson.com/) API:

- Products: `GET /products`
- Categories: `GET /products/categories`
- Search: `GET /products/search?q={query}`
- Login: `POST /auth/login`

## License

MIT
