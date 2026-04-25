# VueShop - E-Commerce SPA

A modern Single Page Application built with Vue 3, TypeScript, and Tailwind CSS, consuming data from the DummyJSON API.

## Features

- **Product Listing**: Browse products from DummyJSON API
- **Search & Filter**: Search products by name and filter by category
- **Product Details**: View detailed product information in a modal
- **Shopping Cart**: Add products to cart with quantity management (persisted in localStorage)
- **Authentication**: Login simulation using DummyJSON Auth API (persisted in localStorage)
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Fully responsive layout for mobile, tablet, and desktop

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
