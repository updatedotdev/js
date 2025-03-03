import { SerializeOptions } from "cookie";
import {
  getAll as defaultGetAll,
  setAll as defaultSetAll,
} from "../../../utils/cookie";
import { GetAllCookies, SetAllCookies } from "../types/cookie";
import { CookieOptions } from "../types/options";

export class StorageClient {
  constructor(
    private getAll: GetAllCookies | undefined,
    private setAll: SetAllCookies | undefined
  ) {
    this.getAll = getAll;
    this.setAll = setAll;
  }

  async set(name: string, value: string, options: Partial<SerializeOptions>) {}

  async get(name: string): Promise<string | undefined> {
    const cookies = await this.getAll?.();

    if (!cookies) {
      return undefined;
    }

    return cookies.find((cookie) => cookie.name === name)?.value;
  }
}

export function createStorageFromOptions(cookies?: CookieOptions) {
  if (cookies == null)
    return new StorageClient(defaultGetAll, defaultSetAll as SetAllCookies);
  return new StorageClient(
    cookies.getAll || defaultGetAll,
    cookies.setAll || (defaultSetAll as SetAllCookies)
  );
}
