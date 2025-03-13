import {
  ApiResponse,
  CoreRequestOptions,
  RequestOptions,
} from '../providers/supabase/types/request';

export class RequestClient {
  private baseUrl: string;
  private apiKey: string;
  private getAuthorizationToken: () => Promise<string | undefined>;
  private getActiveOrganizationId: () => Promise<string | undefined>;

  constructor({
    baseUrl,
    apiKey,
    getAuthorizationToken,
    getActiveOrganizationId,
  }: {
    baseUrl: string;
    apiKey: string;
    getActiveOrganizationId: () => Promise<string | undefined>;
    getAuthorizationToken: () => Promise<string | undefined>;
  }) {
    this.baseUrl = baseUrl || 'https://api.update.dev/v1';
    this.apiKey = apiKey;
    this.getAuthorizationToken = getAuthorizationToken;
    this.getActiveOrganizationId = getActiveOrganizationId;
  }

  _buildQueryString(
    params:
      | Record<string, string | number | boolean | null | undefined>
      | undefined
  ): string {
    if (params == null) return '';
    const queryString = new URLSearchParams();
    Object.keys(params).forEach((key: string) => {
      if (params[key] == null) return;
      queryString.append(key, String(params[key]));
    });
    return queryString.toString();
  }

  async _execute(url: string, options: RequestInit): Promise<ApiResponse> {
    try {
      const response = await fetch(url, options);
      return response.json() as Promise<ApiResponse>;
    } catch (error) {
      return {
        data: null,
        error: { message: 'There was an error' },
        status: 'ERROR',
      };
    }
  }

  _addParams(
    options: RequestOptions,
    params: Record<string, string | undefined>
  ): RequestOptions {
    const newOptions = { ...options };

    for (const [key, value] of Object.entries(params)) {
      if (value == null) continue;

      if (newOptions.method === 'GET') {
        newOptions.queryParams = {
          ...(newOptions.queryParams || {}),
          [key]: value,
        };
      }

      if (newOptions.method === 'POST') {
        const existingBody =
          typeof newOptions.body === 'object' &&
          newOptions.body !== null &&
          !(newOptions.body instanceof FormData)
            ? newOptions.body
            : {};

        newOptions.body = {
          ...existingBody,
          [key]: value,
        };
      }
    }

    return newOptions;
  }

  async _requestCore<T = any>({
    endpoint,
    method,
    body,
    queryParams,
    headers: requestHeaders = {},
  }: CoreRequestOptions): Promise<ApiResponse<T>> {
    let url = `${this.baseUrl}${endpoint}`;

    if (method === 'GET' && queryParams) {
      const queryString = this._buildQueryString(queryParams);
      url = `${url}?${queryString}`;
    }

    const headers: HeadersInit = new Headers({
      ...requestHeaders,
    });

    const authorizationToken = await this.getAuthorizationToken();

    if (authorizationToken != null) {
      headers.set('Authorization', `Bearer ${authorizationToken}`);
    }

    headers.set('x-api-key', this.apiKey);

    const options: RequestInit = {
      method,
      headers,
    };

    if (method === 'POST' && body instanceof FormData) {
      options.body = body;
    } else if (method === 'POST' && body) {
      headers.set('Content-Type', 'application/json');
      options.body = JSON.stringify(body);
    }

    const { data, status, error } = await this._execute(url, options);

    if (status === 'ERROR') {
      return { data: null, error, status };
    }

    return { data, error: null, status };
  }

  async request<T = unknown>(options: RequestOptions): Promise<ApiResponse<T>> {
    const organizationId = await this.getActiveOrganizationId();
    options = this._addParams(options, { organizationId });
    return this._requestCore(options);
  }
}
