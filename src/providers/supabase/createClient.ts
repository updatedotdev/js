import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";
import { UpdateSupabaseClientOptions } from "./types/options";
import { UpdateSupabaseClient } from "./UpdateSupabaseClient";
import { SupabaseClientOptions } from "@supabase/supabase-js";

export function createClient<
    Database = any,
    SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
    Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any
>(
    updateApiKey: string,
    supabaseUrl: string,
    supabaseKey: string,
    options?: {
        supabase?: SupabaseClientOptions<SchemaName>;
        update?: UpdateSupabaseClientOptions<SchemaName>;
    }
) {
    return new UpdateSupabaseClient<Database, SchemaName, Schema>(
        updateApiKey,
        supabaseUrl,
        supabaseKey,
        {
            supabase: options?.supabase,
            update: options?.update,
        }
    );
}
