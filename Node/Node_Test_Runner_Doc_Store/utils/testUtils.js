const testUtils = {
    generateString(length){
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    createTestRestaurant(){
        const rest = {};
        rest._id = testUtils.generateString(32);
        rest.name = testUtils.generateString(10);
        rest.avgScore = this.getRandomInteger(10,100);

        return rest;
    }
}

export {testUtils}