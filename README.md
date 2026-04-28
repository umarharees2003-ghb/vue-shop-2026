# VueShop - My E-Commerce Side Project

Hey! So I built this little shopping app during my free time to learn Vue 3 better. It's nothing fancy, but it works and I'm pretty happy with how it turned out.

## What It Does

Basically, it's a fully functional e-commerce frontend. You can browse products, search for stuff, add things to your cart, and even go through a fake checkout process. The data comes from DummyJSON API (super useful for practice projects like this).

I also threw in dark mode because... who doesn't love dark mode these days, right?

## Stuff I Learned Building This

- Vue 3 Composition API (finally clicked for me)
- Pinia for state management
- TypeScript (still learning, but getting better)
- Tailwind CSS (controversial opinion: it's actually pretty nice once you get used to it)

## Try It Out

Live version here: [https://umarharees2003-ghb.github.io/vue-shop-2026/](https://umarharees2003-ghb.github.io/vue-shop-2026/)

## Quick Start

```bash
# Clone it
git clone https://github.com/umarharees2003-ghb/vue-shop-2026.git
cd vue-shop-2026

# Install stuff
npm install

# Run it
npm run dev
```

Then hit `http://localhost:5173` in your browser.

## What's Inside

```
src/
├── components/       # Vue components
│   ├── NavBar.vue
│   ├── ProductCard.vue
│   ├── FilterBar.vue
│   ├── ProductModal.vue
│   ├── CheckoutModal.vue
│   ├── CartModal.vue
│   └── AuthModal.vue
├── services/         # API calls
│   └── api.ts
├── stores/           # Pinia stores
│   ├── cart.ts
│   ├── auth.ts
│   └── theme.ts
├── types/            # TypeScript types
│   └── index.ts
├── App.vue
├── main.ts
└── style.css
```

## Test Login

If you want to test the auth stuff:
- Username: `kminchelle`
- Password: `0lelplR`

## Tech Used

- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- Pinia

## API

Huge shoutout to [DummyJSON](https://dummyjson.com/) - made this project so much easier. Check their docs if you want to extend this.

## License

MIT - do whatever you want with this!
