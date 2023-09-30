/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable('quotes', (table) => {
    table.increments("id").primary();
    table.string("ticker", 10).notNullable();
    table.timestamps(true);
    table.text('prices');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTableIfExists("quotes");
};
