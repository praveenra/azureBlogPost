import  express from 'express';
import Post from '../models/Post.js';
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MCP Blog API is running' });
});
// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single post by id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new post
router.post('/', async (req, res) => {
  try {
    const { title, author, category, body } = req.body;
    const post = new Post({ title, author, category, body });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update post
router.put('/:id', async (req, res) => {
  try {
    const { title, author, category, body } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, author, category, body, updatedAt: new Date() },
      { returnDocument: 'after', runValidators: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add comment to post
router.post('/:id/comments', async (req, res) => {
  try {
    const { commenter, text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments.push({ commenter, text });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
