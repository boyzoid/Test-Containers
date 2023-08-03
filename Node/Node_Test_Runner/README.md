# Using Test Containers to Test MySQL Interactions with Node Test Runner

This demo is used to show how you can use [Test Containers](https://testcontainers.com/) to test code that interacts with a MySQL Database.

The examples are meant to show the process that needs to be followed and are not intended as a comprehensive example of how to test code.

These examples use the [Node Test Runner](https://nodejs.org/api/test.html).

## Getting started

Before you can dive into these examples, you need to have Docker Desktop (or an alternative) installed. See the [documentation for use with Node](https://node.testcontainers.org/).

Also, make sure you are running at least version 20.5.0 of Node. 

Once you have cloned the repo, run the following command in the `Node/Node_Test_Runner` directory.

```
npm install
```

To run the tests, run the following command:

```
npm run test
```

This will run the tests and also tells Node to watch the files in the `test` folder for any changes.
