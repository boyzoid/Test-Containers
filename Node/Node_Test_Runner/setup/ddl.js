const ddl = {
    async createUserTable(session) {
        const sql = "CREATE TABLE IF NOT EXISTS `user` " +
            "(id INT NOT NULL AUTO_INCREMENT, " +
            "name VARCHAR(100) NOT NULL, " +
            "PRIMARY KEY (id))";
        await session.execute(sql);
    }
}

export {ddl}