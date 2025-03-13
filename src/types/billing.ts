export type Price = {
  id: string;
  currency: string;
  interval: string;
  unit_amount: number;
  interval_count: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  status: string;
};

export type ProductWithPrices = Product & {
  prices: Price[];
};

export type Subscription = {
  id: string;
  status: 'active' | 'past_due' | 'inactive';
  price: Price;
  product: Product;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  current_period_end: string;
  current_period_start: string;
};

export type CreateCheckoutSession =
  | {
      data: {
        url: string;
      };
      error: null;
    }
  | {
      data: {
        url: null;
      };
      error: {
        message: string;
      };
    };

export type SubscriptionsResponse =
  | {
      data: {
        subscriptions: Subscription[];
      };
      error: null;
    }
  | {
      data: {
        subscriptions: null;
      };
      error: {
        message: string;
      };
    };

export type ProductResponse =
  | {
      data: {
        products: ProductWithPrices[];
      };
      error: null;
    }
  | {
      data: {
        products: null;
      };
      error: {
        message: string;
      };
    };

export type UpdateSubscriptionRequest = {
  cancel_at_period_end: boolean;
};

export type UpdateSubscriptionResponse = {
  data: {
    subscription: Subscription | null;
  };
  error: {
    message: string;
  } | null;
};

export type CreateCheckoutSessionOptions = {
  redirect_url?: string;
};
