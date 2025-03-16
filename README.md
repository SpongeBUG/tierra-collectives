# Tierra Collectives - Shopify App Portfolio

![Tierra Collectives](/project-thumbnail.jpg)

A showcase Shopify application featuring handcrafted artisanal products with a fully customized UI/UX. This project demonstrates expert implementation of modern frontend technologies, elegant animations, and seamless Shopify API integration.

## Features

- 🎨 **Fully Custom Design**: Meticulously crafted UI with custom components, animations, and micro-interactions
- 🔄 **Dark Mode**: System-preference aware with manual toggle
- 📱 **Responsive Layout**: Seamless experience across all devices with custom mobile adaptations
- 🛒 **Complete Shopping Flow**: Product browsing, detailed product views, cart management, and checkout integration
- 🖼️ **Advanced Image Gallery**: Interactive product display with fullscreen mode, zoom functionality, and swipe gestures
- ⚡ **Performance Optimized**: Efficient loading with lazy-loaded images and optimized API calls
- 🔍 **Search & Filtering**: Intuitive product discovery with responsive filtering options
- 💾 **Persistent State**: Shopping cart and user preferences preserved with localStorage

## Technology Stack

- **Frontend Framework**: React with Remix for server-rendered pages
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS with custom theme configuration
- **UI Components**: shadcn UI with custom extensions
- **Animation**: Custom animation components using CSS transitions
- **State Management**: Context API with custom hooks
- **API Integration**: Custom service layer for Shopify Storefront API

## Design System

### Color Palette

- **Primary**: Deep Terracotta `#C85A3B` - Rich, natural tone evoking handcrafted feel
- **Accent**: Golden Beige `#E8C872` - Subtle luxury for CTAs and highlights
- **Neutral Base**: Off-Black `#181818` - Deep contrast for modern look
- **Background**: Warm Ivory `#F5F3EF` - Gentle, clean background
- **Interactive**: Muted Teal `#4B7F52` - Subtle hover effects conveying sustainability

### Typography

- **Headings**: Playfair Display (serif) - Sophisticated, handcrafted look
- **Body Text**: Inter (sans-serif) - Readable and modern
- **Scale**: Custom responsive type scale for all device sizes

### Components

- Custom Button variants with hover effects
- Image cards with secondary image reveal on hover
- Interactive product galleries with gesture support
- Horizontal scrolling collections with navigation
- Animated section reveals on scroll
- Toast notifications for cart actions
- Mobile drawer navigation
- Dark mode toggle with system preference detection

## Project Structure

The project follows a clean, modular architecture:

```
app/
├── components/          # UI components organized by feature
│   ├── cart/            # Cart-related components
│   ├── home/            # Homepage-specific components  
│   ├── layout/          # Layout components (Header, Footer, etc.)
│   ├── product/         # Product display components
│   └── ui/              # Base UI components and animations
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── routes/              # Application routes
├── services/            # API service layer
├── styles/              # Global styles and theme definitions
└── types/               # TypeScript type definitions
```

## Performance Considerations

- Image optimization and lazy loading
- Code splitting for route-based chunking
- Caching of API responses
- Intersection Observer for on-demand animations
- Debounced search and filter inputs
- Optimistic UI updates for cart actions

## Accessibility Features

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Focus management for modals and drawers
- Color contrast compliance
- Screen reader friendly content structure

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables (see `.env.example`)
4. Start the development server with `npm run dev`

## Deployment

The application is configured for deployment to various platforms:

- **Vercel**: Optimized for Vercel deployment with Edge functions
- **Shopify Hosting**: Ready for deployment through Shopify CLI
- **Docker**: Container-ready with included Dockerfile

## Credits

- Design & Development: [Your Name]
- Photography: Unsplash
- Font: Playfair Display (Google Fonts), Inter (Google Fonts)
- Icons: Lucide React

## License

This project is available as a portfolio showcase and is not licensed for commercial use without permission.

---

© 2025 [Your Name]. All Rights Reserved.