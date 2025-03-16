// app/data/mockCollections.ts
import type { Collection } from '~/types';
import mockProducts from './mockProducts';

// Group products by type to create collections
const groupProductsByType = () => {
  const productsByType: Record<string, typeof mockProducts> = {};
  
  mockProducts.forEach(product => {
    if (!productsByType[product.productType]) {
      productsByType[product.productType] = [];
    }
    productsByType[product.productType].push(product);
  });
  
  return productsByType;
};

// Create collections from product types
const createCollections = (): Collection[] => {
  const productsByType = groupProductsByType();
  const collections: Collection[] = [];
  
  // Collection images
  const collectionImages = {
    'Home Decor': {
      id: 'coll-img-1',
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200&h=900',
      altText: 'Home Decor Collection',
      width: 1200,
      height: 900
    },
    'Wall Art': {
      id: 'coll-img-2',
      url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200&h=900',
      altText: 'Wall Art Collection',
      width: 1200,
      height: 900
    },
    'Kitchen & Dining': {
      id: 'coll-img-3',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1200&h=900',
      altText: 'Kitchen & Dining Collection',
      width: 1200,
      height: 900
    },
    'Jewelry': {
      id: 'coll-img-4',
      url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200&h=900',
      altText: 'Jewelry Collection',
      width: 1200,
      height: 900
    },
    // Default image for any other collections
    'default': {
      id: 'coll-img-default',
      url: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=1200&h=900',
      altText: 'Collection Image',
      width: 1200,
      height: 900
    }
  };
  
  // Collection descriptions
  const collectionDescriptions = {
    'Home Decor': 'Elevate your living space with our handcrafted home decor items. Each piece is carefully made by skilled artisans using traditional techniques.',
    'Wall Art': 'Transform your walls with our collection of handmade wall art. From macramé to woven tapestries, each piece adds texture and warmth to your space.',
    'Kitchen & Dining': 'Bring artisanal beauty to your table with our handcrafted kitchen and dining essentials. Functional art that makes every meal special.',
    'Jewelry': 'Adorn yourself with our collection of handcrafted jewelry. Each piece tells a story of tradition, skill, and artistic expression.',
    'default': 'Discover our curated collection of handcrafted products. Made with care by skilled artisans from around the world.'
  };
  
  Object.entries(productsByType).forEach(([productType, products], index) => {
    const handle = productType.toLowerCase().replace(/&|\s+/g, '-');
    const image = collectionImages[productType as keyof typeof collectionImages] || collectionImages.default;
    const description = collectionDescriptions[productType as keyof typeof collectionDescriptions] || collectionDescriptions.default;
    
    collections.push({
      id: `coll${index + 1}`,
      title: productType,
      handle,
      description,
      descriptionHtml: `<p>${description}</p>`,
      image,
      products,
      updatedAt: new Date().toISOString()
    });
  });
  
  // Add a special featured collection
  collections.push({
    id: 'coll-featured',
    title: 'Artisan Favorites',
    handle: 'artisan-favorites',
    description: 'Our most beloved handcrafted items, selected for their exceptional quality and unique design.',
    descriptionHtml: '<p>Our most beloved handcrafted items, selected for their exceptional quality and unique design.</p>',
    image: {
      id: 'coll-img-featured',
      url: 'https://images.unsplash.com/photo-1619551734325-81aaf323686c?auto=format&fit=crop&q=80&w=1200&h=900',
      altText: 'Artisan Favorites Collection',
      width: 1200,
      height: 900
    },
    products: mockProducts.filter((_, index) => index % 2 === 0), // Every other product
    updatedAt: new Date().toISOString()
  });
  
  return collections;
};

export const mockCollections = createCollections();
export default mockCollections;