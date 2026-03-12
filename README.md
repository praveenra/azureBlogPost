# MCP Blog API

Node.js 20 + Express + MongoDB REST API for the MCP Blog.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure MongoDB URI
3. Ensure MongoDB is running locally or use a cloud connection string

## Run

- Development: `npm run dev`
- Production: `npm start`

## API Endpoints

- `GET /api/posts` - List all posts
- `GET /api/posts/:id` - Get single post with comments
- `POST /api/posts` - Create post (`title`, `author`, `category`, `body`)
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/comments` - Add comment (`commenter`, `text`)
