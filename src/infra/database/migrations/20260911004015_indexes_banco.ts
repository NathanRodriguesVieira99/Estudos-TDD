import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("banco", (table: Knex.TableBuilder) => {
    table.index("codigo");
  });
  await knex.schema.alterTable("banco", (table: Knex.TableBuilder) => {
    table.index("nome");
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.alterTable("banco", (table: Knex.TableBuilder) => {
    table.dropIndex("codigo");
    table.dropIndex("nome");
  });
}
