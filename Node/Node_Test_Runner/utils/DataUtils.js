import mysql from 'mysql2/promise'

export default class DataUtils{
    #pool
    constructor(dbUser, dbPassword, dbHost, dbPort, schemaName) {
        this.#pool = mysql.createPool({
            host: dbHost,
            port: dbPort, // classic protocol
            user: dbUser,
            password: dbPassword,
            database: schemaName,
            waitForConnections: true,
            connectionLimit: 10,
        })
    }

    async getSession(){
        return this.#pool
    }

    async getUserByName(name) {
        const session = await this.getSession();
        const sql = 'SELECT id, name FROM `user` WHERE name = ?'
        const [rows] = await session.execute(sql, [name])
        // rows is already an array of objects like { id, name }
        return rows
    }
}