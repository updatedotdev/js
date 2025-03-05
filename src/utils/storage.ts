import { SerializeOptions } from 'cookie';
import { GetAllCookies, SetAllCookies } from '../types/cookie';

export type StorageOptions = {
  getAll?: GetAllCookies;
  setAll?: SetAllCookies;
};

export class StorageClient {
  constructor(
    private getAll: GetAllCookies,
    private setAll: SetAllCookies | undefined
  ) {
    this.getAll = getAll;
    this.setAll = setAll;
  }

  async set(
    name: string,
    value: string,
    options: Partial<SerializeOptions>
  ): Promise<void> {
    if (this.setAll == null) return;

    await this.setAll([{ name, value, options }]);
  }

  async get(name: string): Promise<string | undefined> {
    const cookies = await this.getAll();

    if (!cookies) {
      return undefined;
    }

    return cookies.find(cookie => cookie.name === name)?.value;
  }
}
