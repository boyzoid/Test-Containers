import knex from 'knex';
export default class UserRepo{
    #myKnex
    constructor(dbUser, dbPassword, dbHost, dbPort, schemaName) {
        const config = {
            client: 'mysql2',
            connection: {
                host: dbHost,
                port: dbPort,
                user: dbUser,
                password: dbPassword,
                database: schemaName
            },
            pool: {
                min: 2,
                max: 10
            }
        }
        this.#myKnex = new knex(config)
    }

    async addUser(user){
        const result = await this.#myKnex('user').insert(user);
        return result[0];
    }
}