import * as mysqlx from '@mysql/xdevapi'
export default class UserRepo{
    #connectionUrl
    #pool
    constructor(dbUser, dbPassword, dbHost, dbPort, schemaName) {
        this.#connectionUrl =
            `mysqlx://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${schemaName}`
        this.#pool = mysqlx.getClient(this.#connectionUrl, {
            pooling: {
                enabled: true,
                maxSize: 10,
                maxIdleTime: 20000,
                queueTimeout: 5000
            }
        })
    }

    async getSession(){
        return await this.#pool.getSession()
    }

    async createUser(user) {
        const session = await this.getSession();
        const db = session.getSchema();
        const table = db.getTable('user');
        table.insert(['name'])
            .values(user.name)
            .execute();
        session.close();
    }
}