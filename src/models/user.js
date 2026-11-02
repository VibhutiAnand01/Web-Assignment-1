import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const schema = new mongoose.Schema({
  username: { type: String, trim: true, lowercase: true, required: true, unique: true, maxlength: 50 },
  email: { type: String, trim: true, lowercase: true, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { type: String, required: true, minlength: 5, maxlength: 50, select: false,
    validate: value => Buffer.byteLength(value) <= 72 }
}, { timestamps: true });

schema.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model('User', schema);
