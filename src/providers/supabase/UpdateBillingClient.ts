import { Subscription } from '../../types';
import { RequestClient } from '../../utils/request';
import {
  CreateCheckoutSession,
  SubscriptionsResponse,
  ProductResponse,
  ProductWithPrices,
  UpdateSubscriptionRequest,
  UpdateSubscriptionResponse,
  CreateCheckoutSessionOptions,
} from '../../types/billing';
import { UpdateClientBillingOptions } from '../../types/options';

export class UpdateBillingClient {
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

  async createCheckoutSession(
    id: string,
    options?: CreateCheckoutSessionOptions
  ): Promise<CreateCheckoutSession> {
    const { data, error } = await this.requestClient.request<string>({
      endpoint: '/billing/checkout/create',
      method: 'POST',
      body: {
        id,
        options,
      },
      headers: {
        'X-Update-Environment': this.environment,
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

  async getProducts(): Promise<ProductResponse> {
    const { data, error } = await this.requestClient.request<
      ProductWithPrices[]
    >({
      endpoint: '/billing/products',
      method: 'GET',
      headers: {
        'X-Update-Environment': this.environment,
      },
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
    const { data, error } = await this.requestClient.request<Subscription[]>({
      endpoint: '/billing/subscriptions',
      method: 'GET',
      headers: {
        'X-Update-Environment': this.environment,
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
    const { data, error } = await this.requestClient.request<Subscription>({
      endpoint: '/billing/subscriptions/update',
      method: 'POST',
      body: {
        id,
        cancel_at_period_end,
      },
      headers: {
        'X-Update-Environment': this.environment,
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
}
