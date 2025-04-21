// src/config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: process.env.DB_TYPE || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '#SUPER99m',
  database: process.env.DB_DATABASE || 'seo',
  // Use entity patterns instead of direct imports
  entities: ['dist/**/*.entity{.ts,.js}'],
  // Or if you prefer to specify exact paths:
  // entities: ['dist/client/users/users.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
}));
