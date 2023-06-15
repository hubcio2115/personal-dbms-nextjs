# Personal Data DBMS

This is a nextjs project that I made for frontend class during my university course. Use it hoverer you like.

This is a simple user interface for managing personal information data of users stored on a database.

Users can:

- see other users data, which were set to _public_
- add their's personal information which are bound to their acocunt
- change or delete their personal information

Admin can:

- see other users data, no matter if it's _public_ or _private_
- add his data (I don't know what would be purpose for this be he can do it)
- change or delete any user's data stored on the database

# How to setup the project

Since the project uses a local keycloak service as a provider and a postgres db to store the data you need to start the containers. Everything is saved within the `docker-compose.yml` you just need to enter into this project's root directory and run `docker compose up -d`. That's it for the services part.

Next you need to fill out the `.env` file. **THE PROJECT WON'T RUN WITHOUT IT**. Every variable is correctly filled out in the `.env.example` file. They are set specifically for this exact project. You just need to change the file's name to `.env` and it should work.

Passwords and accounts created for the presentation purposes:

App:

- admin account:

  - login: admin
  - password: admin123

- example user account:

  - login: christhompson
  - password: chris123

Keycloak:

- login: admin
- password: admin

Postgres:

- login: keycloak
- password: admin

## How to run the project

You can use preferable node package manager (it is recommended you use `pnpm`). If you don't use `pnpm` you need to delete the file `pnpm-lock.yml` it could create some conflicts with the dependencies. To run the project you can start in either developer mode or build a production version and run it.

Npm:

```bash
# developer
npm run dev

# production
npm run build && npm run start
```

Yarn:

```bash
# developer
yarn dev

# production
yarn build && yarn start
```

Pnpm:

```bash
# developer
pnpm dev

# production
pnpm build && pnpm start
```

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.
