async function createUser(db, user) {
    console.log(db)
    const table = db.getTable('user');
    table.insert(['name'])
        .values(user.name)
        .execute();
}

async function getUserByName(session, name) {
    const sql = "SELECT * FROM `user` where name = ?";
    const results = await session.sql(sql).bind(name).execute();
    const data = results.fetchAll();
    return data;
}

module.exports = { createUser, getUserByName }