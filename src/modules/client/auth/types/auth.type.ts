export type SignUpResponse = {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  image?: string;
  code: number;
  language?: number;
  country?: number;
  provider_id?: string;
  provider_type: 'google' | 'local';
  is_active: boolean;
  is_verified: boolean;
  is_enabled: boolean;
  is_deleted: boolean;
};

export type ValidateUserResponse = {
  id: number;
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  image?: string;
  code: number;
  language?: number;
  country?: number;
  provider_id?: string;
  provider_type: 'google' | 'local';
  access_token?: string;
  is_active: boolean;
  is_verified: boolean;
  is_enabled: boolean;
  is_deleted: boolean;
};

export type SignInResponse = SignUpResponse & {
  token: string;
  access_token?: string;
};
