import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class TeachersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async create(data: any) {
    const fields = Object.keys(data);
    const placeholders = fields.map(() => '?').join(', ');
    const values: any[] = Object.values(data);

    const sql = `INSERT INTO teachers (${fields.join(', ')}) VALUES (${placeholders})`;
    const [result] = await this.pool().execute<OkPacket>(sql, values);

    return this.findById(result.insertId);
  }

  async findById(teacher_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM teachers WHERE teacher_id = ?',
      [teacher_id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Teacher with ID ${teacher_id} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM teachers',
    );
    return rows;
  }

  async update(teacher_id: number, partial: Record<string, any>) {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(partial).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return await this.findById(teacher_id);

    values.push(teacher_id);
    const sql = `UPDATE teachers SET ${fields.join(', ')} WHERE teacher_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(teacher_id);
  }

  async delete(teacher_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM teachers WHERE teacher_id = ?',
      [teacher_id],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Teacher with ID ${teacher_id} not found`);
    }
    return { success: true, affectedRows: res.affectedRows };
  }
}