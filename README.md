## Description

Repository which can be used as a starting point for any application requiring a user.

## Quick start
The GitHub repo is configured which GitHub Actions which trigger the creation on a Docker image for the User service.
You can run the User service along with a dockerized Postgres DB. Check out the docker-compose.yml for details.
```bash
$ docker compose up
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```