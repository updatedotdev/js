import { RequestClient } from './utils/request';
import {
  CreateCheckoutSession,
  CreateCheckoutSessionOptions,
  ProductResponse,
  ProductWithPrices,
  Subscription,
  SubscriptionsResponse,
  UpdateSubscriptionRequest,
  UpdateSubscriptionResponse,
} from './types/billing';

export class UpdateBillingClient {
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

  async getProducts(): Promise<ProductResponse> {
    const { data, error } = await this.requestClient.request<
      ProductWithPrices[]
    >({
      endpoint: '/billing/products',
      method: 'GET',
    });

    if (error) {
      return {
        data: {
          products: null,
        },
        error: {
          message: error.message,
        },
      };
    }

    return {
      data: {
        products: data,
      },
      error: null,
    };
  }

  async getSubscriptions(): Promise<SubscriptionsResponse> {
    if (!this.hasSessionToken) {
      console.warn(
        '@updatedev/js: billing.getSubscriptions() called without a session token. You need to add `getSessionToken` to createClient().'
      );
      return {
        data: {
          subscriptions: null,
        },
        error: {
          message: 'No session token',
        },
      };
    }

    const { data, error } = await this.requestClient.request<Subscription[]>({
      endpoint: '/billing/subscriptions',
      method: 'GET',
      extra: {
        includeUser: true,
      },
    });

    if (error) {
      return {
        data: {
          subscriptions: null,
        },
        error: {
          message: error.message,
        },
      };
    }

    return {
      data: {
        subscriptions: data,
      },
      error: null,
    };
  }

  async updateSubscription(
    id: string,
    { cancel_at_period_end }: UpdateSubscriptionRequest
  ): Promise<UpdateSubscriptionResponse> {
    if (!this.hasSessionToken) {
      console.warn(
        '@updatedev/js: billing.updateSubscription() called without a session token. You need to add `getSessionToken` to createClient().'
      );
      return {
        data: {
          subscription: null,
        },
        error: {
          message: 'No session token',
        },
      };
    }

    const { data, error } = await this.requestClient.request<Subscription>({
      endpoint: '/billing/subscriptions/update',
      method: 'POST',
      body: {
        id,
        cancel_at_period_end,
      },
      extra: {
        includeUser: true,
      },
    });

    if (error) {
      return {
        data: {
          subscription: null,
        },
        error: {
          message: error.message,
        },
      };
    }

    return {
      data: {
        subscription: data,
      },
      error: null,
    };
  }

  async createCheckoutSession(
    id: string,
    options?: CreateCheckoutSessionOptions
  ): Promise<CreateCheckoutSession> {
    if (!this.hasSessionToken) {
      console.warn(
        '@updatedev/js: billing.createCheckoutSession() called without a session token. You need to add `getSessionToken` to createClient().'
      );
      return {
        data: {
          url: null,
        },
        error: {
          message: 'No session token',
        },
      };
    }

    const { data, error } = await this.requestClient.request<string>({
      endpoint: '/billing/checkout/create',
      method: 'POST',
      body: {
        id,
        options,
      },
      extra: {
        includeUser: true,
      },
    });

    if (error) {
      return {
        data: {
          url: null,
        },
        error: {
          message: error.message,
        },
      };
    }

    return {
      data: {
        url: data,
      },
      error: null,
    };
  }
}
