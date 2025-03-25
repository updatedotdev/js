export type ListEntitlementsResponse =
  | {
      data: {
        entitlements: string[];
      };
      error: null;
    }
  | {
      data: {
        entitlements: null;
      };
      error: {
        message: string;
      };
    };

export type CheckEntitlementResponse =
  | {
      data: {
        hasAccess: boolean;
      };
      error: null;
    }
  | {
      data: null;
      error: {
        message: string;
      };
    };
