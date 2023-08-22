const docStoreSetup = {
    async createTestCollection(repo) {
        const session = await repo.getSession();
        const schema = await session.getDefaultSchema();
        await schema.createCollection('restaurant');
    },

    async getById(session, id){
        const schema = session.getDefaultSchema();
        const collection = schema.getCollection('restaurant')
        const results = await collection.find("_id = :idParam").bind("idParam", id).execute();
        const data = results.fetchAll();
        session.close();
        return data;

    }
}

export {docStoreSetup}