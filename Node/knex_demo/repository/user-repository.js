import knex from 'knex';
export default class UserRepo{
    #myKnex
    constructor(knex) {
        this.#myKnex = knex
    }

    async addUser(user){
        const result = await this.#myKnex('user').insert(user);
        return result[0];
    }
}