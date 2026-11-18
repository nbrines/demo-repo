import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class DepartmentsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async create(createDto: any) {
    const dto = createDto || {};
    const department_name = dto.department_name || dto.name || '';

    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO departments (department_name) VALUES (?)',
      [department_name]
    );
    
    return {
      success: true,
      department_id: Number(result.insertId),
      department_name,
    };
  }

  async findById(department_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM departments WHERE department_id = ?',
      [department_id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Department with ID ${department_id} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM departments',
    );
    return rows;
  }

  async update(department_id: number, partial: Record<string, any>) {
    const dto = partial || {};
    const department_name = dto.department_name || dto.name;

    if (department_name !== undefined) {
      await this.pool().execute(
        'UPDATE departments SET department_name = ? WHERE department_id = ?',
        [department_name, department_id]
      );
    }
    return this.findById(department_id);
  }

  async delete(department_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM departments WHERE department_id = ?',
      [department_id],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Department with ID ${department_id} not found`);
    }
    return { success: true, affectedRows: res.affectedRows };
  }
}