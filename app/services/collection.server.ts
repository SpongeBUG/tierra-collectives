// app/services/collection.server.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Collection, CollectionsResponse, ApiResponse, Product } from '~/types';
import { mockCollections } from '~/data/mockCollections';
import shopifyService from './shopify.server';

// Cache types
type CacheItem<T> = {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
};

type Cache = {
  [key: string]: CacheItem<any>;
};

// Cache implementation
const cache: Cache = {};

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';

// Helper function to get cached data
function getCachedData<T>(key: string): T | null {
  const item = cache[key];
  if (!item) return null;
  
  const now = Date.now();
  if (now - item.timestamp > item.expiresIn) {
    // Cache expired
    delete cache[key];
    return null;
  }
  
  return item.data as T;
}

// Helper function to cache data
function setCacheData<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): void {
  cache[key] = {
    data,
    timestamp: Date.now(),
    expiresIn
  };
}

/**
 * Service for handling collection-related operations
 */
export class CollectionService {
  /**
   * Fetch all collections with pagination
   * @param first Number of collections to fetch
   * @param after Cursor for pagination
   * @returns Promise with collections response
   */
  public async getAllCollections(first = 20, after?: string): Promise<ApiResponse<CollectionsResponse>> {
    const cacheKey = `collections_${first}_${after || ''}`;
    const cachedData = getCachedData<ApiResponse<CollectionsResponse>>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    // Use mock data if in development mode
    if (isDevelopment) {
      const collections = mockCollections.slice(0, first);
      const result = {
        data: {
          collections,
          hasNextPage: false,
          hasPreviousPage: false,
          totalCount: collections.length,
        },
        status: 200,
      };
      
      // Cache the result for 5 minutes
      setCacheData(cacheKey, result);
      
      return result;
    }

    const query = `
      query GetCollections($first: Int!, $after: String) {
        collections(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              title
              handle
              description
              descriptionHtml
              updatedAt
              image {
                id
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    `;

    const variables = {
      first,
      after: after || null,
    };

    const response = await shopifyService.query<{ collections: any }>(query, variables);

    if (response.error) {
      return {
        data: {
          collections: [],
          hasNextPage: false,
          hasPreviousPage: false,
          totalCount: 0,
        },
        status: response.status,
        error: response.error,
      };
    }

    // Transform the GraphQL response to our Collection type
    const collections = response.data.collections.edges.map((edge: any) => {
      const collection = edge.node;
      return {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
        description: collection.description,
        descriptionHtml: collection.descriptionHtml,
        image: collection.image,
        products: [],
        updatedAt: collection.updatedAt,
      } as Collection;
    });

    const result = {
      data: {
        collections,
        hasNextPage: response.data.collections.pageInfo.hasNextPage,
        hasPreviousPage: response.data.collections.pageInfo.hasPreviousPage,
        totalCount: collections.length,
      },
      status: response.status,
    };
    
    // Cache the result for 5 minutes
    setCacheData(cacheKey, result);
    
    return result;
  }

  /**
   * Fetch a collection by handle with its products
   * @param handle Collection handle
   * @param productCount Number of products to fetch
   * @returns Promise with collection data
   */
  public async getCollectionByHandle(handle: string, productCount = 20): Promise<ApiResponse<{ collection: Collection | null }>> {
    const cacheKey = `collection_${handle}_${productCount}`;
    const cachedData = getCachedData<ApiResponse<{ collection: Collection | null }>>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    // Use mock data if in development mode
    if (isDevelopment) {
      const collection = mockCollections.find(c => c.handle === handle) || null;
      const result = {
        data: { collection },
        status: collection ? 200 : 404,
        error: collection ? undefined : 'Collection not found',
      };
      
      // Cache the result for 5 minutes
      setCacheData(cacheKey, result);
      
      return result;
    }

    const query = `
      query GetCollectionByHandle($handle: String!, $productCount: Int!) {
        collectionByHandle(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          updatedAt
          image {
            id
            url
            altText
            width
            height
          }
          products(first: $productCount) {
            edges {
              node {
                id
                title
                handle
                description
                descriptionHtml
                productType
                tags
                vendor
                availableForSale
                createdAt
                updatedAt
                images(first: 5) {
                  edges {
                    node {
                      id
                      url
                      altText
                      width
                      height
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      title
                      price
                      compareAtPrice
                      availableForSale
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      handle,
      productCount,
    };

    const response = await shopifyService.query<{ collectionByHandle: any }>(query, variables);

    if (response.error || !response.data.collectionByHandle) {
      return {
        data: { collection: null },
        status: response.status,
        error: response.error || 'Collection not found',
      };
    }

    const collection = response.data.collectionByHandle;
    const products = collection.products.edges.map((edge: any) => {
      const product = edge.node;
      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description,
        descriptionHtml: product.descriptionHtml,
        productType: product.productType,
        tags: product.tags,
        vendor: product.vendor,
        availableForSale: product.availableForSale,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        images: product.images.edges.map((imgEdge: any) => imgEdge.node),
        variants: product.variants.edges.map((varEdge: any) => varEdge.node),
      } as Product;
    });

    const result = {
      data: {
        collection: {
          id: collection.id,
          title: collection.title,
          handle: collection.handle,
          description: collection.description,
          descriptionHtml: collection.descriptionHtml,
          image: collection.image,
          products,
          updatedAt: collection.updatedAt,
        } as Collection,
      },
      status: response.status,
    };
    
    // Cache the result for 5 minutes
    setCacheData(cacheKey, result);
    
    return result;
  }
}

// Create a singleton instance
const collectionService = new CollectionService();
export default collectionService;