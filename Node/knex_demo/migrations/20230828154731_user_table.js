
export async function up(knex) {
  const user_type_sql = `CREATE TABLE user_type (
    id int unsigned NOT NULL AUTO_INCREMENT, 
    name varchar(25) DEFAULT NULL, 
    PRIMARY KEY (id), 
    UNIQUE KEY user_type_name_idx (name) )`;
  await knex.raw(user_type_sql);
  
  return knex.schema
    .createTable('user', (table)=>{
        table.increments('id');
        table.string('first_name', 100).notNullable();
        table.string('last_name', 100).notNullable();
        table.string('email', 100).notNullable();
        table.integer('user_type_id').unsigned();
        table.foreign('user_type_id').references('user_type.id');
    })
};

export function down(knex) {
  return knex.schema
    .dropTable('user')
    .dropTable('user_type')
};
