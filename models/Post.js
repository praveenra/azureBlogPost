import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  commenter: { type: String, required: true, minlength: 3 },
  text: { type: String, required: true, minlength: 10 },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5 },
  author: { type: String, required: true, minlength: 3 },
  category: { type: String, required: true, enum: ['tech', 'finance', 'lifestyle'] },
  body: { type: String, required: true, minlength: 50 },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', postSchema);
