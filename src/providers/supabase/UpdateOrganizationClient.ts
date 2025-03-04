import { ACTIVE_ORGANIZATION_ID_KEY } from "./constants";
import { RequestClient } from "./utils/request";
import { MembershipResponse, OrganizationResponse } from "./types/organization";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";
import { StorageClient } from "../../utils/storage";

export class UpdateOrganizationClient<
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any
> {
  private requestClient: RequestClient;
  private storageClient: StorageClient;

  constructor({
    requestClient,
    storageClient,
  }: {
    requestClient: RequestClient;
    storageClient: StorageClient;
  }) {
    this.requestClient = requestClient;
    this.storageClient = storageClient;
  }

  async createOrganization(
    name: string,
    options?: {
      setAsActive: boolean;
    }
  ): Promise<OrganizationResponse> {
    const { data, error } = await this.requestClient.request({
      endpoint: "/organization/create",
      method: "POST",
      body: { name },
    });

    if (error) {
      return {
        data: {
          organization: null,
        },
        error: {
          code: "organization_create_failed",
          message: error.message,
        },
      };
    }

    return {
      data: {
        organization: data,
      },
      error: null,
    };
  }

  async getOrganization(): Promise<OrganizationResponse> {
    const activeOrganization = await this.storageClient.get(
      ACTIVE_ORGANIZATION_ID_KEY
    );

    if (activeOrganization == null) {
      return {
        data: {
          organization: null,
        },
        error: {
          code: "no_active_organization",
          message: "User is not logged in to any organization",
        },
      };
    }

    const { data: orgData, error: orgError } = await this.requestClient.request(
      {
        endpoint: "/organization",
        method: "GET",
        queryParams: {
          organization: activeOrganization,
        },
      }
    );

    if (orgError) {
      return {
        data: {
          organization: null,
        },
        error: {
          code: "organization_get_failed",
          message: orgError.message,
        },
      };
    }

    return {
      data: {
        organization: orgData,
      },
      error: null,
    };
  }

  async getMemberships(): Promise<MembershipResponse> {
    const { data, error } = await this.requestClient.request({
      endpoint: "/organization/memberships",
      method: "GET",
    });

    if (error) {
      return {
        data: null,
        error: {
          code: "organization_memberships_get_failed",
          message: error.message,
        },
      };
    }

    return {
      data,
      error: null,
    };
  }

  async setOrganization(organizationId: string): Promise<void> {
    this.storageClient.set(ACTIVE_ORGANIZATION_ID_KEY, organizationId, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    });
  }
}
