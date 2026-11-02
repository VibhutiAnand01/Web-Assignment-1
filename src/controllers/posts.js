import { Post } from '../models/post.js';

function postFields(body = {}) {
  return Object.fromEntries(['name', 'description', 'age']
    .filter(key => Object.hasOwn(body, key)).map(key => [key, body[key]]));
}

export async function create(req, res) {
  res.status(201).json(await Post.create(postFields(req.body)));
}

export async function list(req, res) {
  res.json(await Post.find().sort({ createdAt: -1 }));
}

export async function update(req, res) {
  const fields = postFields(req.body);
  if (!Object.keys(fields).length) return res.status(400).json({ error: 'Supply name, description or age.' });
  const post = await Post.findByIdAndUpdate(req.params.id, fields, { returnDocument: 'after', runValidators: true });
  if (!post) return res.status(404).json({ error: 'Post not found.' });
  res.json(post);
}

export async function remove(req, res) {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found.' });
  res.sendStatus(204);
}
