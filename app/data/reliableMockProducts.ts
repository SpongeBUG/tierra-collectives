// app/data/reliableMockProducts.ts
import type { Product, ProductImage, ProductVariant } from '~/types';

// Helper function to create a product image with reliable sources
type ProductTypeKey = 'ceramics' | 'textiles' | 'woodworking' | 'jewelry' | 'homeDecor' | 'candles' | 'tableware' | 'wallArt' | 'default';

const createProductImage = (id: string, typeKey: ProductTypeKey, altText: string): ProductImage => {
  // Map of reliable placeholder images by product type
  const RELIABLE_IMAGES = {
    'ceramics': 'https://via.placeholder.com/800x1000/f5ebe6/1e293b?text=Ceramic+Product',
    'textiles': 'https://via.placeholder.com/800x1000/e6f5f0/1e293b?text=Textile+Product',
    'woodworking': 'https://via.placeholder.com/800x1000/f0f5e6/1e293b?text=Wood+Product',
    'jewelry': 'https://via.placeholder.com/800x1000/e6e6f5/1e293b?text=Jewelry+Product',
    'homeDecor': 'https://via.placeholder.com/800x1000/f5e6f0/1e293b?text=Home+Decor',
    'candles': 'https://via.placeholder.com/800x1000/e6f0f5/1e293b?text=Candle+Product',
    'tableware': 'https://via.placeholder.com/800x1000/f0e6f5/1e293b?text=Tableware+Product',
    'wallArt': 'https://via.placeholder.com/800x1000/f5f0e6/1e293b?text=Wall+Art+Product',
    'default': 'https://via.placeholder.com/800x1000/e2e8f0/1e293b?text=Product+Image'
  };

  return {
    id,
    url: RELIABLE_IMAGES[typeKey] || RELIABLE_IMAGES.default,
    altText,
    width: 800,
    height: 1000
  };
};

// Helper function to create a product variant
const createProductVariant = (
  id: string, 
  title: string, 
  price: string, 
  comparePrice: string | null = null,
  available: boolean = true
): ProductVariant => ({
  id,
  title,
  price: {
    amount: price,
    currencyCode: 'USD'
  },
  compareAtPrice: comparePrice ? {
    amount: comparePrice,
    currencyCode: 'USD'
  } : null,
  available,
  sku: `SKU-${id}`,
  requiresShipping: true,
  taxable: true,
  weight: 1,
  weightUnit: 'kg'
});

// Reliable product images that won't fail to load
const productImages = {
  ceramics: [
    createProductImage('img1', 'ceramics', 'Handcrafted ceramic vase'),
    createProductImage('img2', 'ceramics', 'Ceramic vase alternate view')
  ],
  textiles: [
    createProductImage('img3', 'textiles', 'Handwoven textile wall hanging'),
    createProductImage('img4', 'textiles', 'Textile wall hanging detail')
  ],
  woodworking: [
    createProductImage('img5', 'woodworking', 'Wooden serving bowl set'),
    createProductImage('img6', 'woodworking', 'Serving bowl closeup')
  ],
  jewelry: [
    createProductImage('img7', 'jewelry', 'Handcrafted silver earrings'),
    createProductImage('img8', 'jewelry', 'Silver earrings on display')
  ],
  homeDecor: [
    createProductImage('img9', 'homeDecor', 'Handwoven basket'),
    createProductImage('img10', 'homeDecor', 'Basket with plants')
  ],
  candles: [
    createProductImage('img11', 'candles', 'Handmade candles'),
    createProductImage('img12', 'candles', 'Candle closeup')
  ],
  tableware: [
    createProductImage('img13', 'tableware', 'Ceramic dinnerware set'),
    createProductImage('img14', 'tableware', 'Plates stacked')
  ],
  wallArt: [
    createProductImage('img15', 'wallArt', 'Handmade wall hanging'),
    createProductImage('img16', 'wallArt', 'Wall art detail')
  ]
};

// Mock products data with reliable images
export const reliableMockProducts: Product[] = [
  {
    id: 'prod1',
    title: 'Artisan Ceramic Vase',
    handle: 'artisan-ceramic-vase',
    description: 'This handcrafted ceramic vase is made using traditional techniques passed down through generations. Each piece is unique, showcasing the natural variations that occur in the firing process.',
    descriptionHtml: '<p>This handcrafted ceramic vase is made using traditional techniques passed down through generations. Each piece is unique, showcasing the natural variations that occur in the firing process.</p><p>The subtle glaze highlights the natural texture of the clay, making it a perfect centerpiece for any room.</p>',
    productType: 'Home Decor',
    tags: ['Ceramics', 'Vase', 'Handmade', 'Home Decor'],
    vendor: 'Artesanías Mexicanas',
    images: productImages.ceramics,
    variants: [
      createProductVariant('var1', 'Small', '68.00', '75.00'),
      createProductVariant('var2', 'Medium', '88.00', '95.00'),
      createProductVariant('var3', 'Large', '108.00', '120.00')
    ],
    availableForSale: true,
    createdAt: '2023-05-15T10:00:00Z',
    updatedAt: '2023-06-01T14:30:00Z'
  },
  {
    id: 'prod2',
    title: 'Handwoven Wall Hanging',
    handle: 'handwoven-wall-hanging',
    description: 'This wall hanging is handwoven by skilled artisans using natural fibers. The intricate patterns are inspired by ancient traditions and each piece tells a story.',
    descriptionHtml: '<p>This wall hanging is handwoven by skilled artisans using natural fibers. The intricate patterns are inspired by ancient traditions and each piece tells a story.</p><p>The natural dyes create rich, earthy tones that will add warmth to any space in your home.</p>',
    productType: 'Wall Art',
    tags: ['Textile', 'Wall Art', 'Handwoven', 'Home Decor'],
    vendor: 'Peruvian Textiles',
    images: productImages.textiles,
    variants: [
      createProductVariant('var4', 'Small', '120.00', '140.00'),
      createProductVariant('var5', 'Large', '180.00', '210.00')
    ],
    availableForSale: true,
    createdAt: '2023-04-20T09:15:00Z',
    updatedAt: '2023-05-25T11:45:00Z'
  },
  {
    id: 'prod3',
    title: 'Wooden Serving Bowl Set',
    handle: 'wooden-serving-bowl-set',
    description: 'This set of wooden serving bowls is hand-carved from sustainable teak wood. Each bowl showcases the natural grain of the wood, making every piece unique.',
    descriptionHtml: '<p>This set of wooden serving bowls is hand-carved from sustainable teak wood. Each bowl showcases the natural grain of the wood, making every piece unique.</p><p>The food-safe finish ensures these bowls are as practical as they are beautiful.</p>',
    productType: 'Kitchen & Dining',
    tags: ['Woodwork', 'Kitchen', 'Serving', 'Sustainable'],
    vendor: 'Balinese Craftsmen',
    images: productImages.woodworking,
    variants: [
      createProductVariant('var6', 'Set of 3', '135.00', '150.00'),
      createProductVariant('var7', 'Set of 5', '220.00', '250.00', false)
    ],
    availableForSale: true,
    createdAt: '2023-03-10T08:20:00Z',
    updatedAt: '2023-04-15T16:10:00Z'
  },
  {
    id: 'prod4',
    title: 'Silver Filigree Earrings',
    handle: 'silver-filigree-earrings',
    description: 'These sterling silver earrings feature intricate filigree work, handcrafted by master silversmiths. The delicate patterns are inspired by traditional motifs.',
    descriptionHtml: '<p>These sterling silver earrings feature intricate filigree work, handcrafted by master silversmiths. The delicate patterns are inspired by traditional motifs.</p><p>Lightweight and comfortable to wear, these earrings add an elegant touch to any outfit.</p>',
    productType: 'Jewelry',
    tags: ['Silver', 'Earrings', 'Handcrafted', 'Jewelry'],
    vendor: 'Taxco Silversmiths',
    images: productImages.jewelry,
    variants: [
      createProductVariant('var8', 'Silver', '95.00', '120.00')
    ],
    availableForSale: true,
    createdAt: '2023-06-05T11:30:00Z',
    updatedAt: '2023-06-20T09:40:00Z'
  },
  {
    id: 'prod5',
    title: 'Handwoven Market Basket',
    handle: 'handwoven-market-basket',
    description: 'This market basket is handwoven from sustainable materials by skilled artisans. Perfect for shopping trips or as a decorative piece in your home.',
    descriptionHtml: '<p>This market basket is handwoven from sustainable materials by skilled artisans. Perfect for shopping trips or as a decorative piece in your home.</p><p>The sturdy construction ensures this basket will last for years to come.</p>',
    productType: 'Home Decor',
    tags: ['Basket', 'Handwoven', 'Sustainable', 'Home Decor'],
    vendor: 'Ghanaian Weavers',
    images: productImages.homeDecor,
    variants: [
      createProductVariant('var9', 'Medium', '85.00', '95.00'),
      createProductVariant('var10', 'Large', '110.00', '125.00')
    ],
    availableForSale: true,
    createdAt: '2023-02-15T14:25:00Z',
    updatedAt: '2023-03-10T10:15:00Z'
  },
  {
    id: 'prod6',
    title: 'Hand-Poured Soy Candles',
    handle: 'hand-poured-soy-candles',
    description: 'These soy candles are hand-poured and scented with essential oils. Made with all-natural ingredients, they burn clean and provide a beautiful ambiance.',
    descriptionHtml: '<p>These soy candles are hand-poured and scented with essential oils. Made with all-natural ingredients, they burn clean and provide a beautiful ambiance.</p><p>Each candle burns for approximately 45 hours.</p>',
    productType: 'Home Decor',
    tags: ['Candles', 'Handmade', 'Sustainable', 'Home Decor'],
    vendor: 'Eco Lights',
    images: productImages.candles,
    variants: [
      createProductVariant('var11', 'Lavender', '28.00', '35.00'),
      createProductVariant('var12', 'Sandalwood', '28.00', '35.00'),
      createProductVariant('var13', 'Citrus', '28.00', '35.00')
    ],
    availableForSale: true,
    createdAt: '2023-07-01T15:40:00Z',
    updatedAt: '2023-07-15T08:30:00Z'
  },
  {
    id: 'prod7',
    title: 'Ceramic Dinner Plate Set',
    handle: 'ceramic-dinner-plate-set',
    description: 'This set of ceramic dinner plates is handmade and glazed with food-safe materials. The organic shape and subtle variations make each plate unique.',
    descriptionHtml: '<p>This set of ceramic dinner plates is handmade and glazed with food-safe materials. The organic shape and subtle variations make each plate unique.</p><p>Dishwasher and microwave safe, these plates are as practical as they are beautiful.</p>',
    productType: 'Kitchen & Dining',
    tags: ['Ceramics', 'Dinnerware', 'Handmade', 'Kitchen'],
    vendor: 'Portuguese Pottery',
    images: productImages.tableware,
    variants: [
      createProductVariant('var14', 'Set of 4', '120.00', '140.00'),
      createProductVariant('var15', 'Set of 6', '170.00', '195.00')
    ],
    availableForSale: true,
    createdAt: '2023-05-20T13:10:00Z',
    updatedAt: '2023-06-10T09:25:00Z'
  },
  {
    id: 'prod8',
    title: 'Macramé Wall Hanging',
    handle: 'macrame-wall-hanging',
    description: 'This macramé wall hanging is handcrafted using natural cotton rope. The intricate knotting techniques create a beautiful texture that adds warmth to any wall.',
    descriptionHtml: '<p>This macramé wall hanging is handcrafted using natural cotton rope. The intricate knotting techniques create a beautiful texture that adds warmth to any wall.</p><p>Each piece is made to order and may have slight variations, making it truly one-of-a-kind.</p>',
    productType: 'Wall Art',
    tags: ['Macramé', 'Wall Art', 'Handmade', 'Home Decor'],
    vendor: 'Fiber Arts Collective',
    images: productImages.wallArt,
    variants: [
      createProductVariant('var16', 'Small', '75.00', '90.00'),
      createProductVariant('var17', 'Medium', '110.00', '130.00'),
      createProductVariant('var18', 'Large', '165.00', '185.00', false)
    ],
    availableForSale: true,
    createdAt: '2023-04-05T10:55:00Z',
    updatedAt: '2023-05-01T15:20:00Z'
  }
];

export default reliableMockProducts;