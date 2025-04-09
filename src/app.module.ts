// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';

// Import configuration files
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';

@Module({
  imports: [
    // Load configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
      //envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      envFilePath: `.env`,
    }),
    
    // Database
    DatabaseModule,
    
    // Feature modules
    UsersModule,
  ],
})
export class AppModule {}
