# Web programming assignment · Backend tutorial

An Express API for registering users, signing in and out, and managing posts in MongoDB. The project follows freeCodeCamp's [Intro to Backend Web Development](https://www.youtube.com/watch?v=KOutPbKc9UM).

## 1. Install the project

Use Node.js 22.9 or later. From the project folder, run `npm ci`.

## 2. Configure MongoDB Atlas

1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com/) and create a project and a free cluster.
2. Create a database user with read/write access to the assignment database. Add your current IP address to the project's IP access list.
3. In the cluster's **Connect → Drivers** dialog, copy the Node.js connection string. Replace the username and password placeholders, URL-encode special characters in the credentials, and put `backend_tutorial` after the hostname and before the query string.
4. If you do not already have a `.env` file, copy `.env.example` to `.env`. Set `MONGODBURI` to the resulting connection string. For a local MongoDB server, use `mongodb://127.0.0.1:27017/backend_tutorial`.
5. Set `SESSION_SECRET` to a random value. Generate one with `node -p "require('node:crypto').randomBytes(32).toString('hex')"`. Git ignores `.env`.

## 3. Start the API

Run `npm start`, or use `npm run dev` to restart automatically after edits. The default URL is `http://localhost:4000`. The server connects to MongoDB and initializes the user indexes before accepting requests.

## 4. Explore the routes

Routes in `src/routes` map HTTP methods and paths to functions in `src/controllers`. The schemas in `src/models` validate records before MongoDB stores them. User passwords are hashed with bcrypt. Login creates a MongoDB-backed session and logout destroys it. Post endpoints are public as in the tutorial.

| Method | Path | JSON request body | Success |
| --- | --- | --- | --- |
| POST | `/api/v1/users/register` | `{"username":"ada","email":"ada@example.test","password":"practice123"}` | 201 |
| POST | `/api/v1/users/login` | `{"username":"ada","password":"practice123"}` | 200 |
| POST | `/api/v1/users/logout` | None | 204 |
| POST | `/api/v1/posts/create` | `{"name":"Ada","description":"Lab notes","age":20}` | 201 |
| GET | `/api/v1/posts/getPosts` | None | 200 |
| PATCH | `/api/v1/posts/update/:id` | `{"description":"Updated lab notes"}` | 200 |
| DELETE | `/api/v1/posts/delete/:id` | None | 204 |

For manual requests, replace `:id` with the `_id` returned by **Create post**. The PATCH request changes only the supplied fields. Age must be an integer from 1 to 150.

## 5. Test in Postman Desktop

1. Start the API. Open Postman Desktop and import `postman/backend.postman_collection.json`.
2. Select the **Backend tutorial** collection, choose **Run**, and run all requests in order. The collection uses the default local URL. Edit its `baseUrl` variable if you changed the port.
3. Check that all 12 tests pass. The collection registers a unique test user, checks duplicate registration and invalid login, logs in, exercises the full post lifecycle, verifies deletion, and logs out. Each run leaves one test user and removes its test post.
4. In Atlas, open the data explorer and inspect the `users` collection. To inspect a post before it is deleted, send the collection requests individually and stop after **Create post**.

To run the same collection from a terminal with the API running, use `npx newman run postman/backend.postman_collection.json`.
