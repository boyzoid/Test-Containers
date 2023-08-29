import knex from 'knex';
import mysql from 'mysql2'

export default class DbUtils{
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
            },
            migrations: {
                tableName: 'knex_migrations'
            }
        }
        this.#myKnex = new knex(config)
    }
    async runLatestMigration(){
        console.log('Running migrations')
        await this.#myKnex.migrate.latest({directory: './migrations'})
        console.log('Migrations complete');
    }
    async runSeed(){
        await this.#myKnex.seed.run()
        console.log('Seed complete');
    }
    async tableExists(name){
        return await this.#myKnex.schema.hasTable(name);
    }

    async rowCount(tableName){
        const result = await this.#myKnex(tableName).count('id as count');
        return result[0].count;
    }

    async getRandomId( tableName, columnName ){
        const result = await this.#myKnex.raw(`select ${columnName} as id from ${tableName} order by rand()`);
        return result[0][0].id;
    }

    async getById(id, tableName, columnName){
        const result = await this.#myKnex.raw(`select * from ${tableName} where ${columnName} = ${id}`);
        return result[0][0];
    }
}