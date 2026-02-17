import { test, describe, before, after } from 'node:test'
import { strict as assert } from 'node:assert'
import {MySqlContainer} from "@testcontainers/mysql"
import { faker } from '@faker-js/faker'
import { ddl } from "../setup/ddl.js"
import UserRepo from "../repository/userRepository.js"
import DataUtils from "../utils/DataUtils.js"

describe('Scott\'s Amazing Test Demo!!', async (t) => {
    let container;
    let userRepo;
    let dataUtils;

    before(async ()=>{
        // Explicitly set image to avoid environment-specific defaults issues
        container = await new MySqlContainer('mysql:8.4').withExposedPorts(3306, 33060).start();  
        userRepo = new UserRepo(
            container.getUsername(),
            container.getUserPassword(),
            container.getHost(),
            container.getMappedPort(3306),
            container.getDatabase()
            )
        await ddl.createUserTable(await userRepo.getSession());
        dataUtils = new DataUtils(
            container.getUsername(),
            container.getUserPassword(),
            container.getHost(),
            container.getMappedPort(3306),
            container.getDatabase()
        )
    })

    after(async ()=>{
        await container.stop();
    })
    await test('Container should be running', async (t)=>{
        const queryResult = await container.executeQuery("SELECT 1 as res")
        assert.ok(queryResult.includes("res\n1\n") )
    });

    await test('Should create user', async(t)=>{
        const name= faker.internet.username()
        console.log(`Test name: ${name}.`)
        await userRepo.createUser({name: name})
        const queryResult = await dataUtils.getUserByName(name)
        assert.equal(1, queryResult.length)
        assert.equal(name, queryResult[0].name)
    })
  
  })