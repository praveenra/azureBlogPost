import express from "express";
import postsRouter from "./routes/posts.js"
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
console.log("process.env.BASE_URL =>", process.env.BASE_URL)
// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MCP Blog API',
    version: '1.0.0',
    description: 'API for managing blog posts',
  },
  servers: [
    {
      url: process.env.BASE_URL || 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

// Use swagger-ui-express for your app documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Root route required for Azure Web App for Containers health checks
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "MCP Blog API is running" });
});

app.use("/api/posts", postsRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
