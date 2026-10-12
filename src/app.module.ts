import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/department_id.module';
import { TeachersModule } from './teachers/teachers_id.module';
import { SectionsModule } from './sections/sections_id.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    DepartmentsModule,
    TeachersModule,
    SectionsModule,
  ],
})
export class AppModule {}