export class UpdateUserType {
  first_name?: string;

  last_name?: string;

  username?: string;

  email?: string;

  password?: string;

  image?: string;

  code?: number;

  language?: number;

  country?: number;

  refresh_token?: string;

  provider_id?: string;

  provider_type?: 'google' | 'local';

  is_active?: boolean;

  is_verified?: boolean;

  is_enabled?: boolean;

  is_deleted?: boolean;
}
