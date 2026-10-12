import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers_id.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('teachers')
export class TeachersController {
  constructor(private teachersService: TeachersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.teachersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.teachersService.findById(+id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.teachersService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.teachersService.update(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.teachersService.delete(+id);
  }
}