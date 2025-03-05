import { Membership } from "../../../types";
import { Organization } from "../../../types/organization";

type ErrorCode = "no_active_organization" | "no_organization_memberships";

type OrganizationError = {
  code: ErrorCode | (string & {}) | undefined;
  message: string;
};

export type OrganizationResponse =
  | {
      data: {
        organization: Organization;
      };
      error: null;
    }
  | {
      data: {
        organization: null;
      };
      error: OrganizationError;
    };

export type MembershipResponse =
  | {
      data: Membership[];
      error: null;
    }
  | {
      data: null;
      error: OrganizationError;
    };
