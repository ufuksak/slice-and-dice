# slice-dice

Clean, simple, agnostic REST API scaffold; built with TypeScript, Express, Passport, JWT, Redis, TypeORM and all the good stuff.

slice-dice includes out-of-the-box:
- Environment management
- CORS handling and secure headers (cors, helmet)
- Support for JSON and Form-URL-Encoded bodies
- Logging (morgan)
- BaseEntity Class you can use to extend your TypeORM models. (Keep it D.R.Y)
- Authentication & Authorization with Passport Local & JWT strategies
- Uses Redis as in-memory store for the refresh tokens
- Docker image file for when you're ready to build for production (optional)
- Swagger UI for OpenAPI Docs

Notes:
- TypeORM is set to use memory db sqljs, but you can change it to PostgreSQL, Mysql, Mongo, etc.
- You can turn it into an SSR app if you wanted to; just add a template engine, some views, public folder, and you got yourself a web app.

## How to run?

### Pre-requisites
- (Recommended, optional) Node 18
- Install with: `npm install`
- Run with: `npm run watch-node`

### Development
1. Edit `./src/config/config.ts` and set your development environment variables under `env`.
2. install dependencies with `npm install`
3. open a 1st terminal and run `npm run build:dev`. This will execute the typescript compiler in `watch mode`.

#### Using Docker (optional)
1. Add `.env` and set your development environment variables.
2. build docker image with: `docker build -t some-image-name:tag .` (the dot `.` means the root folder of your project)
3. run docker container with: `docker run --name some-container-name -p local_port:3000 -d some-image-name:tag`
4. or run docker-compose with: `docker-compose up`

## Swagger UI 

Edit the swagger file `/src/openapi/api.schema.yml`.
Generate the endpoint changes `npm run generate-types`.
API docs found at `localhost:3000/api-docs/`.

## Integration Tests
Run the tests with `npm run test`. 
See the coverage results.
```
 PASS  src/test/main.controller.it.ts (15.423 s)
  slice dice tests
    User Operations IT
      ✓ should return 201 on creating a user (227 ms)
      ✓ should return 204 on deleting the user (40 ms)
      ✓ should return 500 if the user duplicates (76 ms)
      ✓ should return 401 when the expired token provided (13 ms)
    Salary Operations IT
      ✓ should return the salary statistics (110 ms)
      ✓ should return the salary statistics by on contract filter (88 ms)
      ✓ should return the salary statistics by the department (94 ms)
      ✓ should return the salary statistics by department and subDepartment (87 ms)

---------------------|---------|----------|---------|---------|-------------------------------------------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                     
---------------------|---------|----------|---------|---------|-------------------------------------------------------
All files            |   82.66 |    63.63 |   83.33 |   80.22 |                                                       
 src                 |     100 |      100 |     100 |     100 |                                                       
  routes.ts          |     100 |      100 |     100 |     100 |                                                       
 src/constants       |     100 |      100 |     100 |     100 |                                                       
  index.ts           |     100 |      100 |     100 |     100 |                                                       
 src/controller      |   54.76 |    69.23 |      50 |   54.76 |                                                       
  main.controller.ts |   54.76 |    69.23 |      50 |   54.76 | 29,33-38,43-56,64,76-77,83-90,109-110,115-133,143-144 
 src/orm             |     100 |      100 |     100 |     100 |                                                       
  index.ts           |     100 |      100 |     100 |     100 |                                                       
 src/orm/entity      |   98.29 |        0 |   92.59 |    97.5 |                                                       
  address.ts         |     100 |      100 |     100 |     100 |                                                       
  base.ts            |     100 |      100 |     100 |     100 |                                                       
  department.ts      |     100 |      100 |     100 |     100 |                                                       
  privilege.ts       |   89.47 |        0 |      50 |   85.71 | 43-44                                                 
  salary.ts          |     100 |      100 |     100 |     100 |                                                       
  subdepartment.ts   |     100 |      100 |     100 |     100 |                                                       
  user.ts            |     100 |      100 |     100 |     100 |                                                       
 src/services        |   84.21 |    66.66 |   88.88 |   84.21 |                                                       
  main.services.ts   |   84.21 |    66.66 |   88.88 |   84.21 | 80-82,89-93,117-127                                   
 src/test            |     100 |      100 |     100 |     100 |                                                       
  init.app.ts        |     100 |      100 |     100 |     100 |                                                       
  test.datasource.ts |     100 |      100 |     100 |     100 |                                                       
---------------------|---------|----------|---------|---------|-------------------------------------------------------
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        15.799 s, estimated 22 s
Ran all test suites.
```

**enjoy** :)
