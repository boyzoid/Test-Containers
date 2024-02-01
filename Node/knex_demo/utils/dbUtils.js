import knex from 'knex';

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
        this.#myKnex = new knex(config);
    }

    getKnex(){
        return this.#myKnex;
    }

    async runLatestMigration(){
        await this.#myKnex.migrate.latest();
    }

    async runSeed(){
        await this.#myKnex.seed.run();
    }

    async tableExists(name){
        return await this.#myKnex.schema.hasTable(name);
    }

    async rowCount(tableName){
        const result = await this.#myKnex(tableName).count('id as count');
        return result[0].count;
    }

    async getRandomColumnValue( tableName, columnName ){
        const result = await this.#myKnex.raw(`select ${columnName} as val from ${tableName} order by rand() limit 1`);
        return result[0][0].val;
    }

    async getById(id, tableName, columnName){
        const result = await this.#myKnex.raw(`select * from ${tableName} where ${columnName} = ${id}`);
        return result[0][0];
    }

    async killKnex(){
        await this.#myKnex.destroy();
    }
}