import { GetToken } from '../types/options';
import {
  ApiResponse,
  CoreRequestOptions,
  RequestOptions,
} from '../types/request';

export class RequestClient {
  private baseUrl: string;
  private getAuthorizationToken?: GetToken;
  private headers?: Record<string, string>;
  private baseBody?: Record<string, string | undefined>;

  constructor({
    baseUrl,
    headers,
    getAuthorizationToken,
    baseBody,
  }: {
    baseUrl: string;
    headers?: Record<string, string | undefined>;
    getAuthorizationToken?: GetToken;
    baseBody?: Record<string, string | undefined>;
  }) {
    this.baseUrl = baseUrl || 'https://api.update.dev/v1';
    this.headers = this._getDefinedObject(headers);
    this.baseBody = this._getDefinedObject(baseBody);
    this.getAuthorizationToken = getAuthorizationToken;
    this.baseBody = baseBody;
  }

  private _getDefinedObject(headers?: Record<string, string | undefined>) {
    let definedHeaders: Record<string, string> = {};
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (value !== undefined) {
          definedHeaders[key] = value;
        }
      });
    }
    return definedHeaders;
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

  async _requestCore<T = any>(
    options: CoreRequestOptions
  ): Promise<ApiResponse<T>> {
    const { method, endpoint } = options;
    let body = options.body;
    let queryParams = options.queryParams;
    let requestHeaders = options.headers;

    let url = `${this.baseUrl}${endpoint}`;

    // Add base body to GET requests
    if (method === 'GET' && this.baseBody) {
      queryParams = {
        ...(queryParams || {}),
        ...this.baseBody,
      };
    }

    // Add base body to POST requests
    if (method === 'POST' && this.baseBody) {
      body = {
        ...(body || {}),
        ...this.baseBody,
      };
    }

    if (method === 'GET' && queryParams) {
      const queryString = this._buildQueryString(queryParams);
      url = `${url}?${queryString}`;
    }

    const headers: HeadersInit = new Headers({
      ...requestHeaders,
      ...(this.headers || {}),
    });

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (method === 'POST' && body) {
      headers.set('Content-Type', 'application/json');
      requestOptions.body = JSON.stringify(body);
    }

    const { data, status, error } = await this._execute(url, requestOptions);

    if (status === 'ERROR') {
      return { data: null, error, status };
    }

    return { data, error: null, status };
  }

  async request<T = unknown>(options: RequestOptions): Promise<ApiResponse<T>> {
    let requestOptions = { ...options };

    if (
      requestOptions.extra?.includeUser != null &&
      requestOptions.extra.includeUser &&
      this.getAuthorizationToken
    ) {
      const authorizationToken = await this.getAuthorizationToken();
      if (authorizationToken) {
        requestOptions.headers = {
          ...requestOptions.headers,
          Authorization: `Bearer ${authorizationToken}`,
        };
      }
    }

    return this._requestCore(requestOptions);
  }
}
