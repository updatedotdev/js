export interface UpdateClientBillingOptions {
  environment?: 'live' | 'test';
}

export interface UpdateClientOptions {
  billing?: UpdateClientBillingOptions;
  apiUrl?: string;
}
