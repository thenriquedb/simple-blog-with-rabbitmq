import { knex } from '../database/db';
import { User } from '../entities/User';

export class UserRepository {
  static create(data: { name: string, email: string }) {
    const { email, name } = data;
    return knex<User>('users').insert({ name, email });
  }

  static findByEmail(email: string) {
    return knex<User>('users').where({ email }).first();
  }

  static findById(id: number) {
    return knex<User>('users').where({ id }).first();
  }
}