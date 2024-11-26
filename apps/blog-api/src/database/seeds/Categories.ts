import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("categories").del();

    await knex("categories").insert([
        { id: 1, name: "Technology" },
        { id: 2, name: "Sports" },
        { id: 3, name: "Weather" },
        { id: 4, name: "Policy" },
        { id: 5, name: "Lifestyle" },
    ]);
};
