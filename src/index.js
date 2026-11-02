import mongoose from 'mongoose';
import { createApp } from './app.js';
import { User } from './models/user.js';

const { MONGODBURI, SESSION_SECRET, PORT = 4000 } = process.env;
if (!MONGODBURI || !SESSION_SECRET || SESSION_SECRET === 'replace-with-a-random-secret') {
  throw new Error('Set MONGODBURI and a random SESSION_SECRET in .env before starting.');
}

try {
  await mongoose.connect(MONGODBURI, { serverSelectionTimeoutMS: 10000 });
  await User.init();
  createApp(mongoose.connection.getClient(), SESSION_SECRET)
    .listen(PORT, () => console.log('Backend listening on port ' + PORT));
} catch (error) {
  console.error('Database startup failed (' + error.name + '). Check the URI, credentials and network access.');
  await mongoose.disconnect();
  process.exitCode = 1;
}
