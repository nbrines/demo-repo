import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class DepartmentsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async create(data: any) {
    const fields = Object.keys(data);
    const placeholders = fields.map(() => '?').join(', ');
    const values: any[] = Object.values(data);

    const sql = `INSERT INTO departments (${fields.join(', ')}) VALUES (${placeholders})`;
    const [result] = await this.pool().execute<OkPacket>(sql, values);

    return this.findById(result.insertId);
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
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(partial).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return await this.findById(department_id);

    values.push(department_id);
    const sql = `UPDATE departments SET ${fields.join(', ')} WHERE department_id = ?`;
    await this.pool().execute(sql, values);
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