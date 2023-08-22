import { test, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import {MySqlContainer} from "testcontainers";
import { docStoreSetup } from "../setup/document_store.js";
import { testUtils } from "../utils/testUtils.js";
import RestaurantRepo from "../repository/restaurant-repository.js";

test('Testing Restaurant Repository', async (t) => {
    let container;
    let restaurantRepo;

    before(async ()=>{
        container = await new MySqlContainer().withExposedPorts(3306, 33060).start();  
        restaurantRepo = new RestaurantRepo(
            container.getUsername(),
            container.getUserPassword(),
            container.getHost(),
            container.getMappedPort(33060),
            container.getDatabase()
            )
        await docStoreSetup.createTestCollection(restaurantRepo); 
    })

    after(async ()=>{
        await container.stop();
    })
    await t.test('Container should be running', async (t)=>{
        const queryResult = await container.executeQuery("SELECT 1 as res");
        assert.equal(queryResult,"res\n1\n" )
    });

    await t.test('Should create restaurant', async(t)=>{
        const test_restaurant = testUtils.createTestRestaurant();
        const result = await restaurantRepo.addRestaurant(test_restaurant);
        const testData = await docStoreSetup.getById(await restaurantRepo.getSession(), test_restaurant._id);
        assert.equal(result, true);
        assert.equal(testData.length, 1);
        assert.equal(testData[0]._id, test_restaurant._id)
    })
  
  }); 