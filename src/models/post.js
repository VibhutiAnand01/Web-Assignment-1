import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 1, max: 150, validate: Number.isInteger }
}, { timestamps: true });

export const Post = mongoose.model('Post', schema);
