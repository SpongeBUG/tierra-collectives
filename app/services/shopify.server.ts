// app/services/shopify.server.ts
import type { ApiResponse, ShopifyError } from "~/types";

/**
 * Base service for Shopify API interactions
 * Handles authentication and common request patterns
 */
export class ShopifyService {
  private baseUrl: string;
  private apiVersion: string;
  private accessToken: string | null;

  constructor() {
    this.baseUrl = process.env.SHOPIFY_STOREFRONT_API_URL || '';
    this.apiVersion = process.env.SHOPIFY_API_VERSION || '2025-01';
    this.accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || null;
  }

  /**
   * Execute a GraphQL query against the Shopify Storefront API
   * @param query GraphQL query string
   * @param variables Variables for the query
   * @returns Promise with the query response
   */
  public async query<T>(query: string, variables: Record<string, unknown> = {}): Promise<ApiResponse<T>> {
    try {
      if (!this.accessToken) {
        throw new Error('Shopify access token is not configured');
      }

      const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.accessToken,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const json = await response.json();

      if (json.errors) {
        return {
          data: {} as T,
          status: response.status,
          error: json.errors[0]?.message || 'Unknown GraphQL error',
        };
      }

      return {
        data: json.data as T,
        status: response.status,
      };
    } catch (error) {
      const shopifyError = error as ShopifyError;
      return {
        data: {} as T,
        status: shopifyError.status || 500,
        error: shopifyError.message || 'An unknown error occurred',
      };
    }
  }
}

// Create a singleton instance
const shopifyService = new ShopifyService();
export default shopifyService;