import { CookieOptions } from "./options";

export type GetAllCookies = () =>
  | Promise<{ name: string; value: string }[] | null>
  | { name: string; value: string }[]
  | null;

export type SetAllCookies = (
  cookies: {
    name: string;
    value: string;
    options: CookieOptions;
  }[]
) => Promise<void> | void;

export type CookieMethodsBrowser = {
  getAll: GetAllCookies;
  setAll: SetAllCookies;
};

export type CookieMethodsServer = {
  getAll: GetAllCookies;
  setAll?: SetAllCookies;
};
