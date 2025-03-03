import {
  createClient as createSupabaseClient,
  SupabaseClient,
} from "@supabase/supabase-js";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";
import { ACTIVE_ORGANIZATION_ID_KEY } from "./constants";
import { UpdateBillingClient } from "./UpdateBillingClient";
import { UpdateOrganizationClient } from "./UpdateOrganizationClient";
import { UpdateSupabaseAuth } from "./UpdateSupabaseAuth";
import { UpdateSupabaseClientOptions } from "./types/options";
import { RequestClient } from "./utils/request";
import { createStorageFromOptions, StorageClient } from "./utils/storage";

export class UpdateSupabaseClient<
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any
> {
  private supabase: SupabaseClient<Database, SchemaName, Schema>;
  private storageClient: StorageClient;
  auth: UpdateSupabaseAuth;
  from: typeof this.supabase.from;
  rpc: typeof this.supabase.rpc;
  storage: typeof this.supabase.storage;
  functions: typeof this.supabase.functions;
  realtime: typeof this.supabase.realtime;
  billing: UpdateBillingClient;
  organization: UpdateOrganizationClient;

  constructor(
    protected readonly apiKey: string,
    protected readonly supabaseUrl: string,
    protected readonly supabaseKey: string,
    options: UpdateSupabaseClientOptions<SchemaName>
  ) {
    this.supabase = this._initializeSupabase(supabaseUrl, supabaseKey, options);
    this.from = this.supabase.from.bind(this.supabase);
    this.rpc = this.supabase.rpc.bind(this.supabase);
    this.storage = this.supabase.storage;
    this.functions = this.supabase.functions;
    this.realtime = this.supabase.realtime;

    this.storageClient = createStorageFromOptions(options.cookies);

    const requestClient = new RequestClient({
      baseUrl: "https://api.update.dev/v1",
      apiKey: this.apiKey,
      getActiveOrganizationId: () => this._getActiveOrganizationId(),
      getAuthorizationToken: () => this._getAuthorizationToken(),
    });

    this.auth = new UpdateSupabaseAuth(this.supabase.auth, requestClient);
    this.billing = new UpdateBillingClient({ requestClient });
    this.organization = new UpdateOrganizationClient({
      requestClient,
      storageClient: this.storageClient,
    });
  }

  private _initializeSupabase(
    supabaseUrl: string,
    supabaseKey: string,
    options: UpdateSupabaseClientOptions<SchemaName>
  ): SupabaseClient<Database, SchemaName, Schema> {
    return createSupabaseClient<Database, SchemaName, Schema>(
      supabaseUrl,
      supabaseKey,
      {
        ...options.supabase,
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
