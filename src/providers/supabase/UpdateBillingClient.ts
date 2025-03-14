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

export class UpdateBillingClient {
  private requestClient: RequestClient;

  constructor({ requestClient }: { requestClient: RequestClient }) {
    this.requestClient = requestClient;
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
