import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import users from './routes/users.js';
import posts from './routes/posts.js';

export function createApp(client, secret) {
  const app = express();
  app.use(express.json());
  app.use(session({
    secret, store: MongoStore.create({ client, dbName: client.db().databaseName }),
    resave: false, saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', maxAge: 3600000 }
  }));
  app.use('/api/v1/users', users);
  app.use('/api/v1/posts', posts);
  app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.code === 11000) return res.status(409).json({ error: 'Username or email already registered.' });
    if (['ValidationError', 'CastError'].includes(error.name) || error.status === 400) {
      return res.status(400).json({ error: 'Invalid request. Check the fields and post ID.' });
    }
    res.status(error.status === 413 ? 413 : 500).json({ error: 'Request could not be processed.' });
  });
  return app;
}
