import { test, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import {MySqlContainer} from "testcontainers";
import { ddl } from "../setup/ddl.js";
import { testUtils } from "../utils/testUtils.js";
import UserRepo from "../repository/user-repository.js";
import DataUtils from "../utils/DataUtils.js";

test('Testing User Repository', async (t) => {
    let container;
    let userRepo;
    let dataUtils;

    before(async ()=>{
        container = await new MySqlContainer().withExposedPorts(3306, 33060).start();  
        userRepo = new UserRepo(
            container.getUsername(),
            container.getUserPassword(),
            container.getHost(),
            container.getMappedPort(33060),
            container.getDatabase()
            )
        await ddl.createUserTable(await userRepo.getSession());
        dataUtils = new DataUtils(
            container.getUsername(),
            container.getUserPassword(),
            container.getHost(),
            container.getMappedPort(33060),
            container.getDatabase()
        )
    })

    after(async ()=>{
        await container.stop();
    })
    await t.test('Container should be running', async (t)=>{
        const queryResult = await container.executeQuery("SELECT 1 as res");
        assert.equal(queryResult,"res\n1\n" )
    });

    await t.test('Should create user', async(t)=>{
        const name = testUtils.generateString(50);
        await userRepo.createUser({name: name});
        const queryResult = await dataUtils.getUserByName(name);
        assert.equal(1, queryResult.length);
        assert.equal(name, queryResult[0].name);
    })
  
  }); 