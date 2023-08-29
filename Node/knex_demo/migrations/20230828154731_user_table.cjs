/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('user_type', (table)=>{
        table.increments('id');
        table.string('name');
        table.unique(['name'], {indexName: 'user_type_name_idx', useConstraint:true})
    })
    .createTable('user', (table)=>{
        table.increments('id');
        table.string('first_name', 100).notNullable();
        table.string('last_name', 100).notNullable();
        table.string('email', 100).notNullable();
        table.integer('user_type_id').unsigned();
        table.foreign('user_type_id').references('user_type.id');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('user')
    .dropTable('user_type')
};
