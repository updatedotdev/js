import {
  User,
  Session,
  AuthError as SupabaseAuthError,
} from '@supabase/supabase-js';

export type ErrorCode =
  | SupabaseAuthError['code']
  | 'auth_callback_failed'
  | 'auth_flow_link_failed';

export class AuthError extends SupabaseAuthError {
  code: ErrorCode | (string & Record<string, unknown>) | undefined;
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.code = code;
  }
}

export type AuthResponse =
  | {
      data: {
        user: User | null;
        session: Session | null;
      };
      error: null;
    }
  | {
      data: {
        user: null;
        session: null;
      };
      error: AuthError;
    };

export type AuthFlowResponse =
  | {
      data: {
        url: string;
      };
      error: null;
    }
  | {
      data: {
        url: null;
      };
      error: AuthError;
    };

export type CreateAuthFlowLinkOptions = {
  type?: 'sign-in' | 'sign-up';
};
