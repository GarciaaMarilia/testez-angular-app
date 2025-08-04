# Yoga

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Start the project

Git clone:

> git clone https://github.com/OpenClassrooms-Student-Center/P5-Full-Stack-testing

Go inside folder:

> cd yoga

Install dependencies:

> npm install

Launch Front-end:

> npm run start;


## Ressources

### Mockoon env 

### Postman collection

For Postman import the collection

> ressources/postman/yoga.postman_collection.json 

by following the documentation: 

https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman


### MySQL

SQL script for creating the schema is available `ressources/sql/script.sql`

By default the admin account is:
- login: yoga@studio.com
- password: test!1234


### Test

#### E2E Cypress

Launching e2e test:

> npm run cypress:open

or

> npm run cypress:run

Generate coverage report (you should launch e2e test before):

> npm run start:coverage

> npm run cypress:run

> npx nyc report --reporter=html --report-dir=coverage

Report is available here:

> front/coverage/cypress/index.html

#### Unitary test

Launching test:

> npm run cypress:open

Generate coverage report (you should launch e2e test before):

> npm run test -- --coverage

Report is available here:

> front/coverage/jest/lcov-report/index.html
