import { isBrowser } from "./environment";
import { serialize, parse, SerializeOptions } from "cookie";

type CookieOptions = Partial<SerializeOptions>;

export function setAll(
  cookies: {
    name: string;
    value: string;
    options: CookieOptions;
  }[]
) {
  if (!isBrowser) return;
  cookies.forEach(({ name, value, options }) => {
    document.cookie = serialize(name, value, options || {});
  });
}

export function getAll() {
  if (!isBrowser) return null;
  const cookies = parse(document.cookie);
  return Object.entries(cookies)
    .filter(([_, v]) => v !== undefined)
    .map(([name, value]) => ({
      name,
      value: value as string, // value cannot be undefined due to filter above
    }));
}
