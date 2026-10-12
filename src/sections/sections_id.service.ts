import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class SectionsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async create(data: any) {
    const fields = Object.keys(data);
    const placeholders = fields.map(() => '?').join(', ');
    const values: any[] = Object.values(data);

    const sql = `INSERT INTO sections (${fields.join(', ')}) VALUES (${placeholders})`;
    const [result] = await this.pool().execute<OkPacket>(sql, values);

    return this.findById(result.insertId);
  }

  async findById(section_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM sections WHERE section_id = ?',
      [section_id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Section with ID ${section_id} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM sections',
    );
    return rows;
  }

  async update(section_id: number, partial: Record<string, any>) {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(partial).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return await this.findById(section_id);

    values.push(section_id);
    const sql = `UPDATE sections SET ${fields.join(', ')} WHERE section_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(section_id);
  }

  async delete(section_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM sections WHERE section_id = ?',
      [section_id],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Section with ID ${section_id} not found`);
    }
    return { success: true, affectedRows: res.affectedRows };
  }
}