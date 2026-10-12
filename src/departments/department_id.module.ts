import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DepartmentsService } from './department_id.service';
import { DepartmentsController } from './department_id.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}