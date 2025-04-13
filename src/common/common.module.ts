import { Global, Module } from '@nestjs/common';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { BaseEntity } from './entities';

@Global()
@Module({
  providers: [LocalAuthGuard, JwtAuthGuard, BaseEntity],
  exports: [LocalAuthGuard, JwtAuthGuard, BaseEntity],
})
export class CommonModule {}
