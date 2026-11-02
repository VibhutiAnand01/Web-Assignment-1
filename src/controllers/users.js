import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';

export async function register(req, res) {
  const { username, email, password } = req.body ?? {};
  if (![username, email, password].every(value => typeof value === 'string')) {
    return res.status(400).json({ error: 'Supply a username, email and password.' });
  }
  const user = await User.create({ username, email, password });
  res.status(201).json({ id: user.id, username: user.username, email: user.email });
}

export async function login(req, res, next) {
  const { username, email, password } = req.body ?? {};
  const identity = email ?? username;
  if (typeof identity !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Supply an email or username and a password.' });
  }
  const user = await User.findOne({ [email == null ? 'username' : 'email']: identity.trim().toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  req.session.regenerate(error => {
    if (error) return next(error);
    req.session.userId = user.id;
    req.session.save(error => error ? next(error) : res.json({ username: user.username }));
  });
}

export function logout(req, res, next) {
  req.session.destroy(error => {
    if (error) return next(error);
    res.clearCookie('connect.sid').sendStatus(204);
  });
}
