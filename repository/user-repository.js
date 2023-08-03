import * as mysqlx from '@mysql/xdevapi'
class UserRepo {
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

    async getUserByName(name) {
        let ret = [];
        const session = await this.getSession();
        const db = session.getSchema();
        const table = db.getTable('user');
        const rows = await table.select(['id', 'name'])
            .where('name = :name')
            .bind('name', name)
            .execute();
        const data = rows.toArray();
        const columns = rows.getColumns()
        ret = this.formatData( data, columns )
        return ret;
        
    }

    formatData(data, columns){
        let ret = [];
        data.forEach((row) =>{
            let obj = {};
            row.forEach((item,i)=>{
                obj[columns[i].getColumnLabel()] = item;
            })
            ret.push(obj)
        })
        return ret;
    }
}

export {UserRepo}