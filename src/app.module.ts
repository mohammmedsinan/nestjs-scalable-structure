// Import Nest Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Import Database Modules
import { DatabaseModule } from './database/database.module';

// Import Shared Modules
import { CommonModule } from './common/common.module';

// Import Client Modules
import { AuthModule } from './modules/client/auth/auth.module';
import { UsersService } from './modules/client/users/users.service';
import { UsersModule } from './modules/client/users/users.module';

// Import configuration files
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

	// Database Modules
    DatabaseModule,

	// Shared Modules
    CommonModule,

	// Client Modules
    AuthModule,
    UsersModule,
  ],
  providers: [UsersService],
})

export class AppModule {}
