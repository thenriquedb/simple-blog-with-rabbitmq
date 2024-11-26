import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("articles", (table) => {
    table.dropColumn("category");
    table.integer("category_id").unsigned().references("id").inTable("categories").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("articles", (table) => {
    table.dropColumn("category_id");
    table.string("category").notNullable();
  });
}

