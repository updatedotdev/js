import {
  CheckEntitlementResponse,
  ListEntitlementsResponse,
} from './types/entitlement';
import { RequestClient } from './utils/request';

export class UpdateEntitlements {
  private requestClient: RequestClient;
  private hasSessionToken: boolean;

  constructor({
    requestClient,
    hasSessionToken,
  }: {
    requestClient: RequestClient;
    hasSessionToken: boolean;
  }) {
    this.requestClient = requestClient;
    this.hasSessionToken = hasSessionToken;
  }

  async list(): Promise<ListEntitlementsResponse> {
    if (!this.hasSessionToken) {
      console.warn(
        '@updatedev/js: entitlements.list() called without a session token. You need to add `getSessionToken` to createClient().'
      );
      return {
        data: {
          entitlements: null,
        },
        error: {
          message: 'No session token',
        },
      };
    }

    const { data, error } = await this.requestClient.request<string[]>({
      endpoint: '/entitlements',
      method: 'GET',
      extra: {
        includeUser: true,
      },
    });

    if (error) {
      return {
        data: {
          entitlements: null,
        },
        error: {
          message: error.message,
        },
      };
    }

    return {
      data: {
        entitlements: data,
      },
      error: null,
    };
  }

  async check(entitlement: string): Promise<CheckEntitlementResponse> {
    if (!this.hasSessionToken) {
      console.warn(
        '@updatedev/js: entitlements.check() called without a session token. You need to add `getSessionToken` to createClient().'
      );
      return {
        data: null,
        error: {
          message: 'No session token',
        },
      };
    }

    const { data, error } = await this.requestClient.request<{
      has_access: boolean;
    }>({
      endpoint: '/entitlements/check',
      method: 'POST',
      body: {
        entitlement,
      },
      extra: {
        includeUser: true,
      },
    });

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
        },
      };
    }

    return {
      data: {
        hasAccess: data.has_access,
      },
      error: null,
    };
  }
}
