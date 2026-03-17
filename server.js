import app from "./app.js";
import connectDB from "./config/db.js";
import config from "./config/index.js";

async function bootstrap() {
  // Connect database
  await connectDB();

  // Start server
  const PORT = config.port;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
  