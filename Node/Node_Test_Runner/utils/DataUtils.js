import * as mysqlx from '@mysql/xdevapi'
export default class DataUtils{
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

    async getUserByName(name) {
        let ret = [];
        const session = await this.getSession();
        const sql = `select id, name from user where name = '${name}'`
        const rows = await session.sql(sql).execute()
        ret = this.formatData(rows)
        session.close();
        return ret;
    }

    formatData(rows){
        const data = rows.toArray()
        const columns = rows.getColumns()
        let ret = [];
        data.forEach((row) =>{
            let obj = {};
            row[0].forEach((item,i)=>{
                obj[columns[i].getColumnLabel()] = item;
            })
            ret.push(obj)
        })
        return ret;
    }
}