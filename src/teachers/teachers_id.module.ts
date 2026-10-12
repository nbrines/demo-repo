import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TeachersService } from './teachers_id.service';
import { TeachersController } from './teachers_id.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}