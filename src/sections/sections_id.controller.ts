import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SectionsService } from './sections_id.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sections')
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.sectionsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.sectionsService.findById(+id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.sectionsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.sectionsService.update(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sectionsService.delete(+id);
  }
}