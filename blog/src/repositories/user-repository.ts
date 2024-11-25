import { knex } from '../database/db';
import { User } from '../entities/User';

export class UserRepository {
  static async create(data: { name: string, email: string }): Promise<number[]> {
    const { email, name } = data;
    return knex('users').insert({ name, email });
  }

  static async findByEmail(email: string): Promise<User> {
    return knex('users').where({ email }).first();
  }

  static async findById(id: number): Promise<User> {
    return knex('users').where({ id }).first();
  }
}