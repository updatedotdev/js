import { SupabaseClient } from '@supabase/supabase-js';
import { RequestClient } from '../../utils/request';
import {
  AuthError,
  AuthFlowResponse,
  AuthResponse,
  CreateAuthFlowLinkOptions,
} from './types/auth';
import { GoTrueClient } from '@supabase/auth-js';

export interface UpdateSupabaseAuth extends GoTrueClient {}

export class UpdateSupabaseAuth {
  constructor(
    private auth: SupabaseClient['auth'],
    private requestClient: RequestClient
  ) {
    return new Proxy(this, {
      get(target: UpdateSupabaseAuth, prop: string | symbol) {
        // First check if the property exists on our class
        if (prop in target) {
          return target[prop as keyof UpdateSupabaseAuth];
        }
        // Otherwise forward to the auth client
        return target.auth[prop as keyof GoTrueClient];
      },
    });
  }

  /**
   * Creates a new auth flow link
   */
  async createAuthFlowLink(
    options?: CreateAuthFlowLinkOptions
  ): Promise<AuthFlowResponse> {
    const { data, error } = await this.requestClient.request<{ url: string }>({
      endpoint: '/auth/flow/create',
      method: 'GET',
      queryParams: options,
    });

    if (error) {
      return {
        data: { url: null },
        error: new AuthError(error.message, 500, 'auth_flow_link_failed'),
      };
    }

    return {
      data: { url: data.url },
      error: null,
    };
  }

  /**
   * Verifies the code from the external auth callback
   */
  async handleAuthCallback(code: string): Promise<AuthResponse> {
    const { data: codeVerificationData, error: codeVerificationError } =
      await this.requestClient.request<{
        access_token: string;
        refresh_token: string;
      }>({
        endpoint: '/auth/flow/verify',
        method: 'POST',
        body: {
          code,
        },
      });

    if (codeVerificationError) {
      return {
        data: {
          session: null,
          user: null,
        },
        error: new AuthError(
          codeVerificationError.message,
          400,
          'auth_callback_failed'
        ),
      };
    }

    const { access_token, refresh_token } = codeVerificationData;

    const { data: setSessionData, error: setSessionError } =
      await this.auth.setSession({
        access_token,
        refresh_token,
      });

    if (setSessionError) {
      return {
        data: {
          session: null,
          user: null,
        },
        error: setSessionError,
      };
    }

    const { session, user } = setSessionData;

    return {
      data: {
        session,
        user,
      },
      error: null,
    };
  }
}
