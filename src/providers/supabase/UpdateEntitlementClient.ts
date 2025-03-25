import { RequestClient } from '../../utils/request';
import { UpdateClientBillingOptions } from '../../types/options';
import {
  CheckEntitlementResponse,
  ListEntitlementsResponse,
} from '../../types/entitlement';
import { ENVIRONMENT_HEADER } from '../../types/internal';

export class UpdateEntitlementClient {
  private environment: string;
  private requestClient: RequestClient;

  constructor({
    environment,
    requestClient,
  }: UpdateClientBillingOptions & {
    requestClient: RequestClient;
  }) {
    this.requestClient = requestClient;
    this.environment = environment ?? 'test';
  }

  async list(): Promise<ListEntitlementsResponse> {
    const { data, error } = await this.requestClient.request<string[]>({
      endpoint: '/entitlements',
      method: 'GET',
      headers: {
        [ENVIRONMENT_HEADER]: this.environment,
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
    const { data, error } = await this.requestClient.request<{
      has_access: boolean;
    }>({
      endpoint: '/entitlements/check',
      method: 'POST',
      body: {
        entitlement,
      },
      headers: {
        [ENVIRONMENT_HEADER]: this.environment,
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
