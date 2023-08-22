import * as mysqlx from '@mysql/xdevapi'
export default class RestaurantRepo{
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

    async addRestaurant(restaurant) {
        let success = true;
        const session = await this.getSession();
        const schema = await session.getDefaultSchema();
        const collection = schema.getCollection('restaurant');
        try{
            await collection.add(restaurant).execute();
        }
        catch(e){
            success = false
        }
        session.close();
        return success;
    }

}