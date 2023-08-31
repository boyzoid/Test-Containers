import { test, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import {MySqlContainer} from "testcontainers";
import DbUtils from "../setup/db_utils.js";
import testUtils from "../utils/testUtils.js";
import UserRepo from "../repository/user-repository.js";

test('Testing Application', async (t) => {
    let container;
    let dbUtils;

    before(async ()=>{
        container = await new MySqlContainer().start();  
        dbUtils = new DbUtils(
            container.getUsername(),
            container.getUserPassword(),
            container.getHost(),
            container.getPort(),
            container.getDatabase()
        )
        await dbUtils.runLatestMigration();
        await dbUtils.runSeed();
    })

    after(async ()=>{
        await container.stop();
    })
    await t.test('Container should be running', async (t)=>{
        const queryResult = await container.executeQuery("SELECT 1 as res");
        assert.equal(queryResult,"res\n1\n", 'Container is not running.' )
    });

    await t.test('Testing Migration', async(t)=>{
        await t.test('User table exists', async (t)=>{
            const exists = await dbUtils.tableExists('user');
            assert(exists, 'USER table does not exist');
        })
        await t.test('User Type table exists', async (t)=>{
            const exists = await dbUtils.tableExists('user_type');
            assert(exists, 'USER_TYPE  table does not');
        })
    })

    await t.test('Testing Seed', async(t)=>{
        await t.test('User data exists', async (t)=>{
            const count = await dbUtils.rowCount('user');
            assert(count != 0, 'USER data does nto exist.');
        })
        await t.test('User Type data exists', async (t)=>{
            const count = await dbUtils.rowCount('user_type');
            assert(count != 0, 'USER_TYPE data does not exist');
        })
    })

    await t.test("Testing User Repo", async(t)=>{
        let userRepo;
        before(async ()=>{
            userRepo = new UserRepo(dbUtils.getKnex())
        })
        await t.test('Can add user', async(t)=>{
            const preTestCount = await dbUtils.rowCount('user');
            const user = {
                user_type_id : await dbUtils.getRandomColumnValue('user_type', 'id'),
                first_name : testUtils.generateString(10),
                last_name : testUtils.generateString(10),
                email : testUtils.generateString(10)
            }
            const result = await userRepo.addUser(user);
            const postTestCount = await dbUtils.rowCount('user');
            const newUser = await dbUtils.getById(result, 'user', 'id');
            assert.equal(preTestCount + 1, postTestCount);
            assert.equal(user.first_name, newUser.first_name);
            assert.equal(user.last_name, newUser.last_name);
            assert.equal(user.email, newUser.email);
            assert.equal(user.user_type_id, newUser.user_type_id);
        })
    })
  
  }); 