import { isBrowser } from './environment';
import { serialize, parse, SerializeOptions } from 'cookie';

type CookieOptions = Partial<SerializeOptions>;

export function setAll(
  cookies: {
    name: string;
    value: string;
    options: CookieOptions;
  }[]
): void {
  if (!isBrowser) return;
  cookies.forEach(({ name, value, options }) => {
    document.cookie = serialize(name, value, options || {});
  });
}

export function getAll():
  | {
      name: string;
      value: string;
    }[]
  | null {
  if (!isBrowser) return null;
  const cookies = parse(document.cookie);
  return Object.entries(cookies)
    .filter(([, v]) => v !== undefined)
    .map(([name, value]) => ({
      name,
      value: value as string, // value cannot be undefined due to filter above
    }));
}
