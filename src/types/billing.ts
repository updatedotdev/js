export type Price = {
  id: string;
  currency: string;
  interval: string;
  unitAmount: number;
  intervalCount: number;
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
  status: string;
  price: Price;
  product: Product;
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
  cancelAtPeriodEnd: boolean;
};

export type UpdateSubscriptionResponse = {
  data: {
    subscription: Subscription | null;
  };
  error: {
    message: string;
  } | null;
};
