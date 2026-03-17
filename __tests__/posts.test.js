import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import Post from '../models/Post.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Post.deleteMany();
});

describe('GET /api/posts', () => {
  it('should return empty array when no posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all posts', async () => {
    const post1 = new Post({ title: 'Test Post 1', author: 'Author 1', category: 'tech', body: 'This is a long body for the test post that meets the minimum length requirement of 50 characters.' });
    const post2 = new Post({ title: 'Test Post 2', author: 'Author 2', category: 'finance', body: 'This is another long body for the second test post that also meets the minimum length requirement.' });
    await post1.save();
    await post2.save();

    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].title).toBe('Test Post 2'); // sorted by updatedAt desc
  });
});

describe('GET /api/posts/:id', () => {
  it('should return a post by id', async () => {
    const post = new Post({ title: 'Test Post', author: 'Author', category: 'tech', body: 'This is a sufficiently long body for the test post that meets the minimum requirements.' });
    await post.save();

    const res = await request(app).get(`/api/posts/${post._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test Post');
  });

  it('should return 404 for non-existent post', async () => {
    const res = await request(app).get('/api/posts/507f1f77bcf86cd799439011');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Post not found');
  });
});

describe('POST /api/posts', () => {
  it('should create a new post', async () => {
    const newPost = { title: 'New Post', author: 'New Author', category: 'tech', body: 'This is a new post body that is long enough to meet the minimum length requirements for testing.' };

    const res = await request(app).post('/api/posts').send(newPost);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Post');

    // Verify in DB
    const posts = await Post.find();
    expect(posts.length).toBe(1);
  });

  it('should return 400 for invalid data', async () => {
    const invalidPost = { title: '', author: 'Author' }; // missing required fields

    const res = await request(app).post('/api/posts').send(invalidPost);
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/posts/:id', () => {
  it('should update a post', async () => {
    const post = new Post({ title: 'Original', author: 'Author', category: 'tech', body: 'This is the original body that is long enough for the test requirements.' });
    await post.save();

    const updates = { title: 'Updated', body: 'This is the updated body that is long enough to meet the minimum length requirements for validation.' };

    const res = await request(app).put(`/api/posts/${post._id}`).send(updates);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');

    // Verify in DB
    const updatedPost = await Post.findById(post._id);
    expect(updatedPost.title).toBe('Updated');
  });

  it('should return 404 for non-existent post', async () => {
    const updates = { title: 'Updated' };

    const res = await request(app).put('/api/posts/507f1f77bcf86cd799439011').send(updates);
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('should delete a post', async () => {
    const post = new Post({ title: 'To Delete', author: 'Author', category: 'tech', body: 'This post is going to be deleted in the test, so it needs a long body.' });
    await post.save();

    const res = await request(app).delete(`/api/posts/${post._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Post deleted');

    // Verify deleted
    const deletedPost = await Post.findById(post._id);
    expect(deletedPost).toBeNull();
  });

  it('should return 404 for non-existent post', async () => {
    const res = await request(app).delete('/api/posts/507f1f77bcf86cd799439011');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/posts/:id/comments', () => {
  it('should add a comment to a post', async () => {
    const post = new Post({ title: 'Posts', author: 'Author', category: 'tech', body: 'This is a post body that is long enough to meet the minimum requirements for the test.' });
    await post.save();

    const comment = { commenter: 'Commenter', text: 'Great post!' };

    const res = await request(app).post(`/api/posts/${post._id}/comments`).send(comment);
    expect(res.status).toBe(201);
    expect(res.body.comments.length).toBe(1);
    expect(res.body.comments[0].commenter).toBe('Commenter');
  });

  it('should return 404 for non-existent post', async () => {
    const comment = { commenter: 'Commenter', text: 'Comment' };

    const res = await request(app).post('/api/posts/507f1f77bcf86cd799439011/comments').send(comment);
    expect(res.status).toBe(404);
  });
});