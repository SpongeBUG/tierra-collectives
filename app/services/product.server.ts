// app/services/product.server.ts - Image Handling Fix
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Product, ProductsResponse, ApiResponse } from '~/types';
import { mockProducts } from '~/data/mockProducts';
import shopifyService from './shopify.server';

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Transform a GraphQL product response to our Product type, 
 * ensuring all fields are correctly mapped
 */
function transformGraphQLProduct(product: any): Product {
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    productType: product.productType,
    tags: Array.isArray(product.tags) ? product.tags : [],
    vendor: product.vendor,
    availableForSale: product.availableForSale,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    // Ensure images are properly transformed
    images: product.images?.edges 
      ? product.images.edges.map((imgEdge: any) => ({
          id: imgEdge.node.id,
          url: imgEdge.node.url,
          altText: imgEdge.node.altText || product.title,
          width: imgEdge.node.width || 800,
          height: imgEdge.node.height || 1000
        }))
      : [],
    // Ensure variants are properly transformed
    variants: product.variants?.edges 
      ? product.variants.edges.map((varEdge: any) => ({
          id: varEdge.node.id,
          title: varEdge.node.title,
          price: {
            amount: varEdge.node.price?.amount || varEdge.node.price || '0.00',
            currencyCode: varEdge.node.price?.currencyCode || 'USD'
          },
          compareAtPrice: varEdge.node.compareAtPrice ? {
            amount: varEdge.node.compareAtPrice.amount || varEdge.node.compareAtPrice || '0.00',
            currencyCode: varEdge.node.compareAtPrice.currencyCode || 'USD'
          } : null,
          available: varEdge.node.availableForSale || false,
          sku: varEdge.node.sku || '',
          requiresShipping: varEdge.node.requiresShipping || true,
          taxable: varEdge.node.taxable || true,
          weight: varEdge.node.weight || 0,
          weightUnit: varEdge.node.weightUnit || 'kg'
        }))
      : []
  };
}

/**
 * Service for handling product-related operations
 */
export class ProductService {
  private cache: Record<string, any> = {};
  private cacheExpiration = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached data if available
   */
  private getCachedData<T>(key: string): T | null {
    const item = this.cache[key];
    if (!item) return null;
    
    const now = Date.now();
    if (now - item.timestamp > this.cacheExpiration) {
      // Cache expired
      delete this.cache[key];
      return null;
    }
    
    return item.data as T;
  }

  /**
   * Set data in cache
   */
  private setCacheData<T>(key: string, data: T): void {
    this.cache[key] = {
      data,
      timestamp: Date.now()
    };
  }

  /**
   * Fetch all products with pagination
   * @param first Number of products to fetch
   * @param after Cursor for pagination
   * @returns Promise with products response
   */
  public async getAllProducts(first = 20, after?: string): Promise<ApiResponse<ProductsResponse>> {
    const cacheKey = `products_${first}_${after || ''}`;
    const cachedData = this.getCachedData<ApiResponse<ProductsResponse>>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    // Use mock data if in development mode
    if (isDevelopment) {
      // Log that we're using mock data
      console.log(`[ProductService] Using mock product data (${mockProducts.length} products)`);
      
      // Add a small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const products = mockProducts.slice(0, first);
      const result = {
        data: {
          products,
          hasNextPage: false,
          hasPreviousPage: false,
          totalCount: products.length,
        },
        status: 200,
      };
      
      // Cache the result
      this.setCacheData(cacheKey, result);
      
      return result;
    }

    const query = `
      query GetProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
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
              productType
              tags
              vendor
              availableForSale
              createdAt
              updatedAt
              images(first: 10) {
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
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                    sku
                    requiresShipping
                    taxable
                    weight
                    weightUnit
                  }
                }
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

    const response = await shopifyService.query<{ products: any }>(query, variables);

    if (response.error) {
      return {
        data: {
          products: [],
          hasNextPage: false,
          hasPreviousPage: false,
          totalCount: 0,
        },
        status: response.status,
        error: response.error,
      };
    }

    // Transform the GraphQL response to our Product type
    const products = response.data.products.edges.map((edge: any) => 
      transformGraphQLProduct(edge.node)
    );

    const result = {
      data: {
        products,
        hasNextPage: response.data.products.pageInfo.hasNextPage,
        hasPreviousPage: response.data.products.pageInfo.hasPreviousPage,
        totalCount: products.length,
      },
      status: response.status,
    };
    
    // Cache the result
    this.setCacheData(cacheKey, result);
    
    return result;
  }

  /**
   * Fetch a single product by handle
   * @param handle Product handle
   * @returns Promise with product data
   */
  public async getProductByHandle(handle: string): Promise<ApiResponse<{ product: Product | null }>> {
    const cacheKey = `product_${handle}`;
    const cachedData = this.getCachedData<ApiResponse<{ product: Product | null }>>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    // Use mock data if in development mode
    if (isDevelopment) {
      console.log(`[ProductService] Using mock data for product: ${handle}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const product = mockProducts.find(p => p.handle === handle) || null;
      const result = {
        data: { product },
        status: product ? 200 : 404,
        error: product ? undefined : 'Product not found',
      };
      
      // Cache the result
      this.setCacheData(cacheKey, result);
      
      return result;
    }

    const query = `
      query GetProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
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
          images(first: 10) {
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
          variants(first: 100) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                sku
                requiresShipping
                taxable
                weight
                weightUnit
              }
            }
          }
        }
      }
    `;

    const variables = {
      handle,
    };

    const response = await shopifyService.query<{ productByHandle: any }>(query, variables);

    if (response.error || !response.data.productByHandle) {
      return {
        data: { product: null },
        status: response.status,
        error: response.error || 'Product not found',
      };
    }

    const product = transformGraphQLProduct(response.data.productByHandle);
    
    const result = {
      data: { product },
      status: response.status,
    };
    
    // Cache the result
    this.setCacheData(cacheKey, result);
    
    return result;
  }
}

// Create a singleton instance
const productService = new ProductService();
export default productService;