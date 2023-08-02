const {MySqlContainer} =  require("testcontainers");
const mysqlx = require("@mysql/xdevapi");
const {createUser, getUserByName} = require("../repository/user-repository");
const {createUserTable} = require("../setup/ddl");
import testUtils from "../utils/testUtils";



describe("User Repository Test Suite", () => {
    jest.setTimeout(60000);

    let container;
    let client;
    let session;

    beforeAll(async () =>{
        container = await new MySqlContainer().withExposedPorts(3306, 33060).start();
        client = await mysqlx.getClient({
            host: container.getHost(),
            password: container.getUserPassword(),
            port: container.getMappedPort(33060),
            user: container.getUsername(),
            schema: container.getDatabase()
        });
        session = await client.getSession();   
        await createUserTable(session);
    })

    afterAll(async () =>{
        await session.close();
        await container.stop();
    })

    it("Should connect and execute query", async () => {
        const queryResult = await container.executeQuery("SELECT 1 as res");
        expect(queryResult).toEqual(expect.stringContaining("res\n1\n"));
    });

    it("Should add users", async () => {
        const name = testUtils.generateString(8);
        createUser(session.getSchema(container.getDatabase()), {name: 'Todd Sharp'});
        const queryResult = await getUserByName(session);
        console.log(queryResult)
    })
})