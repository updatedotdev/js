import { SupabaseClientOptions } from "@supabase/supabase-js";
import { GetAllCookies, SetAllCookies } from "./cookie";
import { UpdateOptions } from "./params";

export type CookieOptions = {
  getAll?: GetAllCookies;
  setAll?: SetAllCookies;
};

export type UpdateSupabaseClientOptions<SchemaName = "public"> = {
  cookies?: CookieOptions;
  supabase?: Omit<SupabaseClientOptions<SchemaName>, "cookies">;
  update?: UpdateOptions;
};
