import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './department_id.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Get() // <-- Removed @UseGuards(JwtAuthGuard) temporarily for testing
  async getAll() {
    return this.departmentsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.departmentsService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async create(@Body() body: any) {
    return this.departmentsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.departmentsService.update(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.departmentsService.delete(+id);
  }
}