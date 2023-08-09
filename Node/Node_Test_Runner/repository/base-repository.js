export default class BaseRepository{
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
