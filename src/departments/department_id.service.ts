import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class DepartmentsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async create(createDto: any) {
    const position_code = createDto.position_code || createDto.code || createDto.department_code;
    const position_name = createDto.position_name || createDto.name || createDto.department_name;

    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO departments (position_code, position_name) VALUES (?, ?)',
      [position_code, position_name]
    );
    
    return {
      success: true,
      department_id: Number(result.insertId),
      position_code,
      position_name,
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
    const position_code = partial.position_code || partial.code || partial.department_code;
    const position_name = partial.position_name || partial.name || partial.department_name;

    const fields: string[] = [];
    const values: any[] = [];

    if (position_code !== undefined) {
      fields.push('position_code = ?');
      values.push(position_code);
    }
    if (position_name !== undefined) {
      fields.push('position_name = ?');
      values.push(position_name);
    }

    if (fields.length === 0) return { success: true, department_id };

    values.push(department_id);
    const sql = `UPDATE departments SET ${fields.join(', ')} WHERE department_id = ?`;
    await this.pool().execute(sql, values);
    return { success: true, department_id, position_code, position_name };
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