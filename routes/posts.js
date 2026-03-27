import  express from 'express';
import Post from '../models/Post.js';
import { sendServiceBusMessage } from '../config/serviceBus.js';
const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     responses:
 *       200:
 *         description: List of posts
 *       500:
 *         description: Server error
 */
// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a single post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post object
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: Indian Rupee Hits Record Low
 *               author:
 *                 type: Raju
 *               category:
 *                 type: finance
 *               body:
 *                 type: The Indian rupee fell to around 92 per dollar, mainly because crude oil prices surged due to tensions in the Middle East. Rising oil costs are putting pressure on India’s economy and stock markets. The Nifty 50 index also dropped about 1%, reflecting investor concerns
 *     responses:
 *       201:
 *         description: Created post
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated post
 *       404:
 *         description: Post not found
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
// DELETE post
router.delete('/:id', async (req, res) => {
  try {
    // const post = await Post.findByIdAndDelete(req.params.id);
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Send message to Azure Service Bus
    try {
      await sendServiceBusMessage({
        postId: req.params.id,
        title: post.title,
        author: post.author,
        category: post.category,
        deletedAt: new Date().toISOString(),
        action: 'DELETE'
      });
    } catch (serviceBusError) {
      console.error('Service Bus error:', serviceBusError);
      // Don't fail the request if Service Bus fails, just log it
    }

    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/posts/{id}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commenter:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 *       404:
 *         description: Post not found
 *       400:
 *         description: Bad request
 */
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
