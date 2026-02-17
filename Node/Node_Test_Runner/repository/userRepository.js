import mysql from 'mysql2/promise'

export default class UserRepo{
    #pool
    constructor(dbUser, dbPassword, dbHost, dbPort, schemaName) {
        // Switch from X DevAPI to mysql2 (classic protocol)
        this.#pool = mysql.createPool({
            host: dbHost,
            port: dbPort, // expect classic port (3306)
            user: dbUser,
            password: dbPassword,
            database: schemaName,
            waitForConnections: true,
            connectionLimit: 10,
        })
    }

    // Keep the same method name to minimize test changes
    async getSession(){
        // Return the pool which supports .execute()
        return this.#pool
    }

    async createUser(user) {
        const session = await this.getSession();
        await session.execute('INSERT INTO `user` (name) VALUES (?)', [user.name])
    }
}