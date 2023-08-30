
export async function seed (knex) {
  await knex('user').del();
  await knex('user_type').del();
  await knex('user_type').insert([
    {id: 1, name: 'User'},
    {id: 2, name: 'Admin'},
    {id: 3, name: 'GodMode'}
  ]);
  await knex('user').insert([
    {id: 1, first_name: 'Scott', last_name: 'Stroz', email: 'scott@test.com', user_type_id: 3},
    {id: 2, first_name: 'Fred', last_name: 'Descamps', email: 'lefred@test.com', user_type_id: 1},
    {id: 3, first_name: 'Lenka', last_name: 'Kasparova', email: 'lenka@test.com', user_type_id: 2}
  ])
};
