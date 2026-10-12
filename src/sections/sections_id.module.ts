import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SectionsService } from './sections_id.service';
import { SectionsController } from './sections_id.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [SectionsController],
  providers: [SectionsService],
  exports: [SectionsService],
})
export class SectionsModule {}