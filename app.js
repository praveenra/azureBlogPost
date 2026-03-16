import express from "express";
import postsRouter from "./routes/posts.js"

const app = express();

app.use(express.json());

// Root route required for Azure Web App for Containers health checks
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "MCP Blog API is running" });
});

app.use("/api/posts", postsRouter);

export default app;
