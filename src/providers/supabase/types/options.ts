import { SupabaseClientOptions } from '@supabase/supabase-js/dist/module/lib/types';

import { StorageOptions } from '../../../utils/storage';
import { UpdateClientOptions } from '../../../types/options';

export type UpdateSupabaseClientOptions<SchemaName> = UpdateClientOptions & {
  storage?: StorageOptions;
  supabase?: SupabaseClientOptions<SchemaName>;
};
