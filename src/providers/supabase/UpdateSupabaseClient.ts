import {
  createClient as createSupabaseClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';
import { ACTIVE_ORGANIZATION_ID_KEY } from '../../constants';
import { UpdateBillingClient } from './UpdateBillingClient';
import { UpdateOrganizationClient } from './UpdateOrganizationClient';
import { UpdateSupabaseAuth } from './UpdateSupabaseAuth';
import { SupabaseClientOptions } from '@supabase/supabase-js';
import { RequestClient } from '../../utils/request';
import { getAll, setAll } from '../../utils';
import { StorageClient, StorageOptions } from '../../utils/storage';
import { UpdateSupabaseClientOptions } from './types/options';

export class UpdateSupabaseClient<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any,
> {
  private supabase: SupabaseClient<Database, SchemaName, Schema>;
  private storageClient: StorageClient;
  auth: UpdateSupabaseAuth;
  from: SupabaseClient['from'];
  rpc: SupabaseClient['rpc'];
  storage: SupabaseClient['storage'];
  functions: SupabaseClient['functions'];
  realtime: SupabaseClient['realtime'];
  billing: UpdateBillingClient;
  organization: UpdateOrganizationClient;

  constructor(
    protected readonly apiKey: string,
    protected readonly supabaseUrl: string,
    protected readonly supabaseKey: string,
    options?: UpdateSupabaseClientOptions<SchemaName>
  ) {
    this.supabase = this._initializeSupabase(
      supabaseUrl,
      supabaseKey,
      options?.supabase
    );
    this.from = this.supabase.from;
    this.rpc = this.supabase.rpc;
    this.storage = this.supabase.storage;
    this.functions = this.supabase.functions;
    this.realtime = this.supabase.realtime;

    this.storageClient = this._initializeStorageClient(options?.storage);

    const requestClient = new RequestClient({
      baseUrl: options?.apiUrl ?? 'https://api.update.dev/v1',
      apiKey: this.apiKey,
      getActiveOrganizationId: () => this._getActiveOrganizationId(),
      getAuthorizationToken: () => this._getAuthorizationToken(),
    });

    this.auth = new UpdateSupabaseAuth(this.supabase.auth, requestClient);
    this.billing = new UpdateBillingClient({
      ...options?.billing,
      requestClient,
    });
    this.organization = new UpdateOrganizationClient({
      requestClient,
      storageClient: this.storageClient,
    });
  }

  private _initializeStorageClient(storage?: StorageOptions): StorageClient {
    if (storage != null && storage.getAll != null)
      return new StorageClient(storage.getAll, storage.setAll);
    return new StorageClient(getAll, setAll);
  }

  private _initializeSupabase(
    supabaseUrl: string,
    supabaseKey: string,
    options?: SupabaseClientOptions<SchemaName>
  ): SupabaseClient<Database, SchemaName, Schema> {
    return createSupabaseClient<Database, SchemaName, Schema>(
      supabaseUrl,
      supabaseKey,
      {
        ...options,
      }
    );
  }

  private async _getAuthorizationToken(): Promise<string | undefined> {
    const { data } = await this.auth.getSession();
    return data.session?.access_token;
  }

  private async _getActiveOrganizationId(): Promise<string | undefined> {
    return this.storageClient.get(ACTIVE_ORGANIZATION_ID_KEY);
  }
}
