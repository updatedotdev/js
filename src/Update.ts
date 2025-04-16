import { API_KEY_HEADER, ENVIRONMENT_HEADER } from './types/internal';
import { UpdateClientOptions } from './types/options';
import { UpdateBillingClient } from './UpdateBilling';
import { UpdateEntitlements } from './UpdateEntitlements';
import { RequestClient } from './utils/request';

export class UpdateClient {
  billing: UpdateBillingClient;
  entitlements: UpdateEntitlements;
  constructor(
    private readonly apiKey: string,
    options: UpdateClientOptions
  ) {
    const billingEnvironment = this.getEnvironment(options);

    const requestClient = new RequestClient({
      baseUrl: options?.apiUrl ?? 'https://api.update.dev/v1',
      headers: {
        [ENVIRONMENT_HEADER]: billingEnvironment,
        [API_KEY_HEADER]: this.apiKey,
      },
      getAuthorizationToken: options.getSessionToken,
    });

    this.billing = new UpdateBillingClient({
      requestClient,
      hasSessionToken: options.getSessionToken !== undefined,
    });

    this.entitlements = new UpdateEntitlements({
      requestClient,
      hasSessionToken: options.getSessionToken !== undefined,
    });
  }

  private getEnvironment(options: UpdateClientOptions): 'live' | 'test' {
    if (options.environment) {
      if (options.environment === 'live') return 'live';
      if (options.environment === 'test') return 'test';
      throw new Error('Invalid environment');
    }

    return 'test';
  }
}
