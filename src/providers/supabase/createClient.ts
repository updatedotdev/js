import {
  GenericSchema,
  SupabaseClientOptions,
} from '@supabase/supabase-js/dist/module/lib/types';
import { UpdateSupabaseClient } from './UpdateSupabaseClient';
import { StorageOptions } from '../../utils/storage';

export function createClient<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any
>(
  updateApiKey: string,
  supabaseUrl: string,
  supabaseKey: string,
  options?: {
    storage?: StorageOptions;
    supabase?: SupabaseClientOptions<SchemaName>;
  }
): UpdateSupabaseClient<Database, SchemaName, Schema> {
  return new UpdateSupabaseClient<Database, SchemaName, Schema>(
    updateApiKey,
    supabaseUrl,
    supabaseKey,
    options
  );
}
