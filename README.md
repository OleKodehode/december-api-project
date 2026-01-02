# Service to Service Entertainment/Media backlog API

API made as a service to service to setup and track a backlog of media entertainment (Movies, Series, Games).

### Setup

---

Make sure to run `npm i` and `npm run setup` before trying to run the server.

`npm run setup` is optional, but a .env file is required for the server to run. It needs a PORT, ACCESS_SECRET and REFRESH_SECRET variable.

### End Points

---

- GET `/v1/health`
  Health check of the server
- POST `/v1/protected`
  Test route for authentication
- POST `/v1/auth/login`
  Login route for authentication. Needed for most endpoints
- GET `/v1/auth/refresh`
  Refresh of JWT
- POST `/v1/auth/logout`
  Logout of the service - Removes Authentication
- GET `/v1/entries/`
  Gets entries tied to your JWT
- POST `/v1/entries/`
  Add new entry
- GET `/v1/entries/:id`
  Gets an entry by a specific ID (If authenticated)
- PATCH `/v1/entries/:id`
  Updates an entry
- DELETE `/v1/entries/:id`
  Deletes an entry

### Scripts

---

- `npm run setup` -> automatic setup of .env file with needed variables. (PORT, ACCESS_SECRET, REFRESH_SECRET)
- `npm run dev` -> Start development server with hot-reload
- `npm test` -> Run tests
- `npm test:watch` -> Run tests in watch mode
- `npm run lint` -> Check code style
- `npm run format` -> Format code with Prettier
- `npm run build` -> Compile to JavaScript
- `npm start` -> Run compiled version
