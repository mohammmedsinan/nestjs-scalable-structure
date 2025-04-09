import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'super-secret',
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '1d',
}));
