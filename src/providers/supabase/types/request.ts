export interface RequestOptions {
  endpoint: string;
  method: "GET" | "POST";
  body?: unknown | FormData;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean | null | undefined>;
}

export interface CoreRequestOptions {
  endpoint: string;
  method: "GET" | "POST";
  body?: unknown | FormData;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean | null | undefined>;
}

export type ApiResponse<T = any> =
  | {
      data: T;
      error: null;
      status: "SUCCESS";
    }
  | {
      data: null;
      error: {
        message: string;
      };
      status: "ERROR";
    };
